export function generateAppointmentMessage({
  subject,
  formattedDate,
  formattedTime,
  fullName,
}: {
  subject: string;
  formattedDate: string;
  formattedTime: string;
  fullName: string;
}) {
  const cleanSubject = subject
    .replace(/^\[\d+\]\s*/, "")       // remove [7]
    .replace(/^Appointment\s*-\s*/i, "") // remove "Appointment - "
    .trim();

  return `I would like to request an appointment for a ${cleanSubject} on ${formattedDate} at ${formattedTime}.\n\nKindly confirm if this schedule is suitable and if you approve my appointment for the ${cleanSubject}.\n\nThank you,\n${fullName}`;
}
