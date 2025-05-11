import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Resend } from "resend";

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
      })
    )
    .mutation(async ({ ctx, input }) => {
      // console.log("Creating appointment with input:", input);

      const appointment = await ctx.db.appointment.create({
        data: {
          datetime: input.datetime,
          message: input.message,
          requesterId: ctx.session.user.id,
        },
      });

      // console.log("Appointment created:", appointment);

      const userEmail = "villegaskierthryan@gmail.com";
      // console.log("Sending email to:", userEmail);

      let emailResponse = null;

      if (userEmail && process.env.AUTH_RESEND_KEY) {
        const resend = new Resend(process.env.AUTH_RESEND_KEY);

        try {
          emailResponse = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "noreply@example.com",
            to: userEmail,
            subject: "Appointment Confirmation",
            text: `Your appointment is confirmed for ${input.datetime.toLocaleString()}.\n\nMessage: ${input.message}`,
          });

          // console.log("Email sent successfully:", emailResponse);
        } catch (error) {
          console.error("Error sending email:", error);
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
