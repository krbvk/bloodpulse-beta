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
        message: z.string().min(1),
        subject: z.enum(["Blood Donation", "Blood Request"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // console.log("Creating appointment with input:", input);

      const appointment = await ctx.db.appointment.create({
        data: {
          datetime: input.datetime,
          message: input.message,
          subject: input.subject === "Blood Donation" ? "BloodDonation" : "BloodRequest",
          requesterId: ctx.session.user.id,
        },
      });

      // console.log("Appointment created:", appointment);

      const userEmail = ctx.session.user.email;
      // console.log("Sending email to:", userEmail);

      let emailResponse = null;

      if (userEmail && process.env.AUTH_RESEND_KEY) {
        const resend = new Resend(process.env.AUTH_RESEND_KEY);
        const formattedDate = dayjs(input.datetime)
        .tz("Asia/Manila")
        .format("YYYY-MM-DD hh:mm A");

        try {
          emailResponse = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "noreply@example.com",
            to: userEmail,
            subject: `Appointment Confirmation: ${input.subject}`,
            text: `Appointment request from: ${ctx.session.user.name} (${ctx.session.user.email})
            Appointment is for: ${formattedDate}
            Message:
            ${generateAppointmentMessage({
              subject: input.subject,
              formattedDate: dayjs(input.datetime).tz("Asia/Manila").format("MMMM D, YYYY"),
              formattedTime: dayjs(input.datetime).tz("Asia/Manila").format("hh:mm A"),
              fullName: ctx.session.user.name ?? "Unknown User",
            })}`,

            html: `
              <div style="font-family: Arial, sans-serif; font-size: 14px; color: #000; line-height: 1.6;">
                <p><strong>Appointment request from:</strong> ${ctx.session.user.name} (${ctx.session.user.email})</p>
                <p><strong>Appointment is for:</strong> ${formattedDate}</p>
                <p><strong>Message:</strong></p>
                <p>${generateAppointmentMessage({
                  subject: input.subject,
                  formattedDate: dayjs(input.datetime).tz("Asia/Manila").format("MMMM D, YYYY"),
                  formattedTime: dayjs(input.datetime).tz("Asia/Manila").format("hh:mm A"),
                  fullName: ctx.session.user.name ?? "Unknown User",
                }).replace(/\n/g, '<br>')}</p>
              </div>
            `.trim(),
          });
          // console.log("Email sent successfully:", emailResponse);
        } catch (error) {
          // console.error("Error sending email:", error);
        }
      } else {
        // console.log("Email not sent, missing userEmail or API Key.");
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
