import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { IconCheck, IconClock, IconMail, IconX } from "@tabler/icons-react";
import {
  Box,
  Title,
  Paper,
  Textarea,
  Button,
  Text,
  Notification,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppointmentLayout() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const timeInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <CustomLoader />;

  if (status === "unauthenticated") return null;

  if (!session?.user) return null;

  const createAppointment = api.appointment.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending appointment request:", error);
    },
  });

  const handleSubmit = () => {
    if (!appointmentDate || !appointmentTime || !message) return;

    const datetime = dayjs(appointmentDate)
      .set("hour", appointmentTime.getHours())
      .set("minute", appointmentTime.getMinutes())
      .set("second", 0)
      .set("millisecond", 0)
      .toDate();

    createAppointment.mutate({ datetime, message });
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const [hoursStr, minutesStr] = input.split(":");

    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      hours >= 0 &&
      hours <= 23 &&
      minutes >= 0 &&
      minutes <= 59
    ) {
      const newTime = new Date();
      newTime.setHours(hours, minutes, 0, 0);
      setAppointmentTime(newTime);
    } else {
      setAppointmentTime(null);
    }
  };

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
            value={formatTime(appointmentTime)}
            onChange={handleTimeChange}
            withAsterisk
            ref={timeInputRef}
            rightSection={
              <ActionIcon
                variant="subtle"
                onClick={() => {
                  const inputEl = timeInputRef.current
                  if (inputEl?.showPicker) {
                    inputEl.showPicker();
                  } else {
                    inputEl?.focus();
                  }
                }}
              >
                <IconClock size={18} />
              </ActionIcon>
            }
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
