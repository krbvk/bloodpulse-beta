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
  return `I would like to request an appointment for a ${subject.toLowerCase()} on ${formattedDate} at ${formattedTime}.\n\nPlease let me know if this schedule is acceptable and if you approve my appointment for the ${subject.toLowerCase()}.\n\nThank you,\n${fullName}`;
}
