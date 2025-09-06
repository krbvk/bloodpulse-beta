"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import {
  IconCheck,
  IconClock,
  IconMail,
  IconPin,
  IconX,
} from "@tabler/icons-react";
import {
  Box,
  Title,
  Paper,
  Button,
  Notification,
  Stack,
  ActionIcon,
  Select,
  Text,
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
  const [subject, setSubject] = useState<
    "Blood Donation" | "Blood Request" | null
  >(null);
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [subjectCount, setSubjectCount] = useState(1);
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
      setBloodType(null);
      setSubjectCount((prev) => prev + 1);
    },
    onError: (error) => {
      setFailed(true);
      setSuccess(false);
      console.error("Error sending appointment request:", error);
    },
  });

  const handleSubmit = () => {
    if (!appointmentDate || !appointmentTime || !subject) return;

    if (subject === "Blood Request" && !bloodType) {
      setFailed(true);
      return;
    }

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

    const generatedMessage = generateAppointmentMessage({
      subject,
      formattedDate,
      formattedTime,
    });

    const displaySubject = `[${subjectCount}] Appointment - ${subject}`;

    createAppointment.mutate({
      datetime,
      subject,
      displaySubject,
      message: generatedMessage,
      bloodType: bloodType ?? undefined,
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
    <Box px={{ base: "md", sm: "lg" }} py="lg">
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

      {/* Centered two-column layout */}
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
     {/* Left side - Appointment Form (fixed height) */}
<Paper
  shadow="md"
  radius="lg"
  p="xl"
  withBorder
  style={{ width: 500, flexShrink: 0, height: "350px" }}
>
  <Stack gap="md" style={{ height: "100%", overflowY: "auto" }}>
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

    {subject === "Blood Request" && (
      <Select
        label="Blood Type"
        placeholder="Select blood type"
        data={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
        value={bloodType}
        onChange={setBloodType}
        withAsterisk
      />
    )}

    <Button
      leftSection={<IconMail size={18} />}
      fullWidth
      onClick={handleSubmit}
      loading={createAppointment.status === "pending"}
      disabled={
        !appointmentDate ||
        !appointmentTime ||
        !subject ||
        !!timeError ||
        (subject === "Blood Request" && !bloodType)
      }
    >
      Send Appointment Request
    </Button>
  </Stack>
</Paper>


        {/* Right side - Sticky Notes */}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            minWidth: 260,
          }}
        >
          {/* Note 1 */}
          <Paper
            shadow="xl"
            p="md"
            style={{
              backgroundColor: "#fffef9",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0,0,0,0.1) 24px)",
              backgroundSize: "100% 24px",
              width: 260,
              height: 320,
              textAlign: "center",
              transform: "rotate(-2deg)",
              borderRadius: "6px",
              boxShadow: "4px 6px 15px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <IconPin
              size={26}
              style={{
                position: "absolute",
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#1565c0",
                filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.6))",
              }}
            />
            <Text fw={600} size="sm" mt="xl" c="black">
              “OLFU RCY <b>blood donation scheduling</b> is available only{" "}
              <br />
              <b>Monday to Friday, 8:00 AM – 5:00 PM.</b>” <br />
              <br />
              If you book an appointment beyond these hours, <br />
              OLFU RCY may not respond immediately. <br />
              Your request will likely be addressed on the next working day.
            </Text>
          </Paper>

          {/* Note 2 */}
          <Paper
            shadow="xl"
            p="md"
            style={{
              backgroundColor: "#fffef9",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0,0,0,0.1) 24px)",
              backgroundSize: "100% 24px",
              width: 260,
              height: 320,
              textAlign: "center",
              transform: "rotate(2deg)",
              borderRadius: "4px",
              boxShadow: "4px 6px 15px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <IconPin
              size={26}
              style={{
                position: "absolute",
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#c62828",
                filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.6))",
              }}
            />
            <Text fw={600} size="sm" mt="xl" c="black">
              “OLFU RCY <b>blood request scheduling</b> is available only <br />
              <b>Monday to Friday, 8:00 AM – 5:00 PM.</b>” <br />
              <br />
              If you book an appointment beyond these hours, <br />
              OLFU RCY may not respond immediately. <br />
              Your request will likely be addressed on the next working day.
            </Text>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
