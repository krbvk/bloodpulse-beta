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

   getAllUserEmails: protectedProcedure
  .input(
    z.object({
      location: z.string().min(3, "Location is required"),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (!process.env.AUTH_RESEND_KEY) {
      throw new Error("Missing Resend API key");
    }

    // 1. Get all user emails
    const users = await ctx.db.user.findMany({
      where: { email: { not: null } },
      select: { email: true },
    });
    const emails = users.map((u) => u.email!) as string[];

    if (emails.length === 0) {
      throw new Error("No user emails found");
    }

    // 2. Prepare Resend client
    const resend = new Resend(process.env.AUTH_RESEND_KEY);

    // 3. Email content
    const subject = "Invitation: Blood Donation Drive at OLFU Valenzuela";
    const textMessage = `This is from Our Lady Of Fatima Valenzuela Red Cross Youth inviting you to join in a Blood Donation Drive happening today from 8:00 AM to 5:00 PM at ${input.location}.`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <h2 style="color: #c62828; text-align: center; margin-bottom: 20px;">
            ❤️ Blood Donation Drive
          </h2>
          
          <p>
            This is from <strong>Our Lady Of Fatima Valenzuela Red Cross Youth</strong>, 
            inviting you to join in a <strong>Blood Donation Drive</strong>.
          </p>

          <p><strong>Date:</strong> Today</p>
          <p><strong>Time:</strong> 8:00 AM – 5:00 PM</p>
          <p><strong>Location:</strong> ${input.location}</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://bloodpulse.tech/" 
              style="display: inline-block; background-color: #c62828; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Join Us Today
            </a>
          </div>

          <p style="font-size: 14px; color: #555; text-align: center; margin-top: 20px;">
            Every drop counts. Your donation can save lives. ❤️
          </p>
        </div>
      </div>
    `;

    // 4. Send to all emails
    let response;
    try {
      response = await resend.emails.send({
        from: process.env.EMAIL ?? "noreply@example.com",
        to: emails,
        subject,
        text: textMessage,
        html: htmlMessage,
      });
    } catch (err) {
      console.error("Error sending bulk email:", err);
      throw new Error("Failed to send email");
    }

    // 5. Return emails + send result
    return { success: true, sentTo: emails, response };
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
        variant: z
          .enum(["whole blood", "packed RBC", "fresh plasma", "frozen plasma"])
          .optional(),
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
          variant: input.variant ?? undefined,
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
          ${
            input.subject === "Blood Request" && input.bloodType
              ? `Blood type needed: ${input.bloodType}${input.variant ? " - " + input.variant : ""}`
              : ""
          }
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
                  ? `<p><strong>Blood type needed:</strong> ${input.bloodType}${
                      input.variant ? " (" + (input.variant) + ")" : ""
                    }</p>`
                  : ""
              }
              <p><strong>Message:</strong></p>
              <div style="white-space: pre-line; font-family: inherit; margin: 0;">${message}</div>
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
