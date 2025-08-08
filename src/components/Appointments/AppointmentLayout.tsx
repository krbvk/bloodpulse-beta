import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { IconCheck, IconClock, IconMail, IconX } from "@tabler/icons-react";
import {
  Box,
  Title,
  Paper,
  Button,
  Notification,
  Stack,
  ActionIcon,
  Select,
  Text
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import { useRouter } from "next/navigation";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { generateAppointmentMessage } from "@/utils/generateAppointmentMessage";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function AppointmentLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [subject, setSubject] = useState<"Blood Donation" | "Blood Request" | null>(null);
  const [failed, setFailed] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <CustomLoader />;
  }

  const createAppointment = api.appointment.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setAppointmentDate(null);
      setAppointmentTime("");
    },
    onError: (error) => {
      setFailed(true);
      setSuccess(false);
      console.error("Error sending appointment request:", error);
    },
  });

  const handleSubmit = () => {
    if (!appointmentDate || !appointmentTime || !subject) return;

    const [hoursStr, minutesStr] = appointmentTime.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    const datetime = dayjs(appointmentDate)
      .set("hour", hours)
      .set("minute", minutes)
      .set("second", 0)
      .set("millisecond", 0)
      .tz("Asia/Manila")
      .toDate();

    const formattedDate = dayjs(datetime).format("MMMM D, YYYY");
    const formattedTime = dayjs(datetime).format("hh:mm A");
    const fullName = session?.user?.name ?? "Your Name";

    const generatedMessage = generateAppointmentMessage({
      subject: subject ?? "Appointment",
      formattedDate,
      formattedTime,
      fullName,
    });

    createAppointment.mutate({
      datetime,
      subject,
      message: generatedMessage,
    });
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
      const dateToCheck = appointmentDate ?? new Date();
      const newTime = new Date(dateToCheck);
      newTime.setHours(hours, minutes, 0, 0);
      const now = new Date();
      const isSameDay = newTime.toDateString() === now.toDateString();
      if (newTime < now && isSameDay) {
        setTimeError("Cannot set a past time for the current day.");
        setAppointmentTime("");
      } else {
        setTimeError(null);
        setAppointmentTime(input);
      }
    } else {
      setAppointmentTime("");
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

      {failed && (
        <Notification
          icon={<IconX />}
          color="red"
          title="Error"
          onClose={() => setFailed(false)}
          mb="md"
        >
          Failed to send appointment request. Please try again.
        </Notification>
      )}

      <Paper shadow="md" radius="lg" p="xl" withBorder>
        <Stack gap="md">
          <DatePickerInput
            label="Date"
            placeholder="Select date"
            value={appointmentDate}
            onChange={(d) => {
              setAppointmentDate(d);
              setTimeError(null);
            }}
            minDate={new Date()}
            withAsterisk
            clearable
            popoverProps={{ withinPortal: true }}
          />

          <TimeInput
            label="Time"
            placeholder="Select time"
            value={appointmentTime}
            onChange={handleTimeChange}
            withAsterisk
            ref={timeInputRef}
            rightSection={
              <ActionIcon
                variant="subtle"
                onClick={() => {
                  const inputEl = timeInputRef.current;
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

          {timeError && (
            <Text c="red" size="sm" mt="xs">
              {timeError}
            </Text>
          )}

          <Select
            label="Subject"
            placeholder="Choose subject"
            data={["Blood Donation", "Blood Request"]}
            value={subject}
            onChange={(value) =>
              setSubject(value as "Blood Donation" | "Blood Request" | null)
            }
            withAsterisk
          />

          <Button
            leftSection={<IconMail size={18} />}
            fullWidth
            onClick={handleSubmit}
            loading={createAppointment.status === "pending"}
            disabled={!appointmentDate || !appointmentTime || !subject || !!timeError}
          >
            Send Appointment Request
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
