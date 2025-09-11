import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Resend } from "resend";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { generateAppointmentMessage } from "@/utils/generateAppointmentMessage";

dayjs.extend(utc);
dayjs.extend(timezone);

export const appointmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.appointment.findMany({
      where: { requesterId: ctx.session.user.id },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        datetime: z.date(),
        displaySubject: z.string(),
        message: z.string().min(1),
        subject: z.enum(["Blood Donation", "Blood Request"]),
        bloodType: z.preprocess(
          (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
          z
            .string()
            .optional()
            .refine(
              (v) => v === undefined || /^(A|B|AB|O)[+-]$/.test(v),
              { message: "Use A+, A-, B+, B-, AB+, AB-, O+, or O-" }
            )
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Build the message dynamically
      const formattedDateLong = dayjs(input.datetime).tz("Asia/Manila").format("MMMM D, YYYY");
      const formattedTime = dayjs(input.datetime).tz("Asia/Manila").format("hh:mm A");

      const message = generateAppointmentMessage({
        subject: input.subject,
        formattedDate: formattedDateLong,
        formattedTime,
        bloodType: input.bloodType,
      });

      // Create appointment in DB
      const appointment = await ctx.db.appointment.create({
        data: {
          datetime: input.datetime,
          message,
          subject: input.subject === "Blood Donation" ? "BloodDonation" : "BloodRequest",
          displaySubject: input.displaySubject,
          requesterId: ctx.session.user.id,
          bloodType: input.bloodType ?? undefined,
        },
      });

      // Email sending
      const userEmail = process.env.SAMPLE_EMAIL; // test
      let emailResponse = null;

      if (userEmail && process.env.AUTH_RESEND_KEY) {
        const resend = new Resend(process.env.AUTH_RESEND_KEY);
        const formattedDate = dayjs(input.datetime).tz("Asia/Manila").format("YYYY-MM-DD hh:mm A");

        try {
          emailResponse = await resend.emails.send({
            from: process.env.EMAIL ?? "noreply@example.com",
            to: userEmail,
            replyTo: ctx.session.user.email ?? undefined,
            subject: input.displaySubject,
            text: `Appointment request from: (${ctx.session.user.email})
          Appointment is for: ${formattedDate}
          ${input.subject === "Blood Request" && input.bloodType ? `Blood type: ${input.bloodType}` : ""}
          Message:
          ${message}`,

          html: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; line-height: 1.6;">
              <p>
                <strong>Appointment request from:</strong>
                (<span style="color: inherit; text-decoration: none;">${ctx.session.user.email}</span>)
              </p>
              <p><strong>Appointment is for:</strong> ${formattedDate}</p>
              ${
                input.subject === "Blood Request" && input.bloodType
                  ? `<p><strong>Blood type needed:</strong> ${input.bloodType}</p>`
                  : ""
              }
              <p><strong>Message:</strong></p>
              <div style="white-space: pre-line; font-family: inherit; margin: 0;">${message}
            </div>
          `.trim(),
          });
        } catch (error) {
          console.error("Error sending appointment email:", error);
        }
      }

      return { appointment, emailResponse };
    }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findUnique({
        where: { id: input },
      });
      return appointment ?? null;
    }),

  getByRequesterId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.appointment.findMany({
        where: { requesterId: input },
      });
    }),
});
