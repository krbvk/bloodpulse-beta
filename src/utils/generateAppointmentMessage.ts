export function generateAppointmentMessage({
  subject,
  formattedDate,
  formattedTime,
  bloodType,
}: {
  subject: string;
  formattedDate: string;
  formattedTime: string;
  bloodType?: string;
}) {
  const cleanSubject = subject
    .replace(/^\[\d+\]\s*/, "")         // remove things like [7]
    .replace(/^Appointment\s*-\s*/i, "") // remove "Appointment - "
    .trim();

  let message = `I would like to request an appointment for ${cleanSubject}. On ${formattedDate} at ${formattedTime}.`;

  // Special case: Blood Request with blood type
  if (/^Blood Request$/i.test(cleanSubject) && bloodType) {
    message += `\nThe blood type needed: ${bloodType} .`;
  }
  message += `\n\nKindly confirm if this schedule is suitable and if you approve my appointment for the ${cleanSubject}.`;
  message += `\n\nThank you`;

  return message;
}