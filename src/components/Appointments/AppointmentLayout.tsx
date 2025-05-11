import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { IconCheck, IconMail, IconX } from "@tabler/icons-react";
import {
  Box,
  Title,
  Paper,
  Textarea,
  Button,
  Text,
  Notification,
  Stack,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";

export default function AppointmentLayout() {
  const { data: session, status } = useSession();

  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const createAppointment = api.appointment.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setAppointmentDate(null);
      setAppointmentTime("");
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending appointment request:", error);
    },
  });

  const convertTo24Hour = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    const [hourStr, minuteStr] = time?.split(":") ?? ["0", "0"];
    let hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return { hour, minute };
  };

  const handleSubmit = () => {
    if (!appointmentDate || !appointmentTime || !message) return;

    const { hour, minute } = convertTo24Hour(appointmentTime);

    const datetime = dayjs(appointmentDate)
      .set("hour", hour)
      .set("minute", minute)
      .set("second", 0)
      .set("millisecond", 0)
      .toDate();

    createAppointment.mutate({ datetime, message });
  };

  const handleTimeChange = (val: string) => {
    if (val) setAppointmentTime(val);
  };

  if (status === "loading") return <Text>Loading session...</Text>;
  if (!session?.user) return <Text>User not logged in</Text>;

  return (
    <Box
      px={{ base: "md", sm: "lg" }}
      py="lg"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Title order={2} mb="lg" style={{ textAlign: "center" }}>
        Book an Appointment
      </Title>

      {success && (
        <Notification
          icon={<IconCheck />}
          color="green"
          title="Request Sent"
          onClose={() => setSuccess(false)}
          mb="md"
        >
          Your appointment request has been sent successfully.
        </Notification>
      )}

      <Paper shadow="md" radius="lg" p="xl" withBorder>
        <Stack gap="md">
          <DatePickerInput
            label="Date"
            placeholder="Select date"
            value={appointmentDate}
            onChange={setAppointmentDate}
            minDate={new Date()}
            withAsterisk
            clearable
            popoverProps={{ withinPortal: true }}
          />

          <TimeInput
            label="Time"
            placeholder="Select time"
            value={appointmentTime}
            onChange={(event) => handleTimeChange(event.currentTarget.value)}
            withAsterisk
          />

          <Textarea
            label="Message"
            placeholder="Enter reason or message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={4}
            withAsterisk
          />

          <Button
            leftSection={<IconMail size={18} />}
            fullWidth
            onClick={handleSubmit}
            loading={createAppointment.status === "pending"}
            disabled={!appointmentDate || !appointmentTime || !message}
          >
            Send Appointment Request
          </Button>

          {createAppointment.status === "error" && (
            <Notification
              icon={<IconX />}
              color="red"
              title="Error"
              onClose={() => createAppointment.reset()}
            >
              Failed to send appointment request. Please try again.
            </Notification>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
