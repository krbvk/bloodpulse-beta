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
  Divider,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <CustomLoader />;
  }

  // --- NEW: donation toggle status ---
  const { data: donationEnabled, refetch } =
    api.donationControl.getStatus.useQuery();

  const toggle = api.donationControl.toggle.useMutation({
    onMutate: (vars) => {
      // console.log("[CLIENT] Toggle called with:", vars);
    },
    onSuccess: (data) => {
      // console.log("[CLIENT] Toggle success, response:", data);
      refetch();
    },
    onError: (error) => {
      console.error("[CLIENT] Toggle failed:", error);
    },
  });

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

    // --- NEW: enforce donation only today ---
    if (
      subject === "Blood Donation" &&
      !dayjs(appointmentDate).isSame(dayjs(), "day")
    ) {
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
    <Box px={{ base: "sm", sm: "lg" }} py="lg">
      <Title order={2} mb="lg" ta="center">
        Book an Appointment
      </Title>

    {donationEnabled !== undefined && (
      <Box maw={800} mx="auto" mb="md">
        <Notification
          color={donationEnabled ? "green" : "red"}
          title={donationEnabled ? "Donation Open" : "Donation Closed"}
          withBorder
        >
          {donationEnabled
            ? "Blood Donation is open for today!"
            : "Blood Donation is currently unavailable. Please wait for the official OLFU RCY blood donation drive event."}
        </Notification>
      </Box>
    )}

      {success && (
        <Box maw={800} mx="auto">
          <Notification
            icon={<IconCheck />}
            color="green"
            title="Request Sent"
            onClose={() => setSuccess(false)}
            mb="md"
          >
            Your appointment request has been sent successfully.
          </Notification>
        </Box>
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

      {/* Responsive two-column layout */}
      <Box
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Left side - Appointment Form */}
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          withBorder
          style={{
            width: isMobile ? "100%" : 500,
            flexShrink: 0,
            transition: "height 0.3s ease",
          }}
        >
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
              maxDate={
                subject === "Blood Donation" && donationEnabled ? new Date() : undefined
              }
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
              placeholder="Select request type"
              data={
                donationEnabled
                  ? ["Blood Donation", "Blood Request"]
                  : ["Blood Request"]
              }
              value={subject}
              onChange={(value) => {
                const selected = value as "Blood Donation" | "Blood Request" | null;
                setSubject(selected);

                if (selected === "Blood Donation" && donationEnabled) {
                  setAppointmentDate(new Date()); // force today
                }
              }}
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
            {session?.user?.role === "ADMIN" && (
              <Button
                variant={donationEnabled ? "filled" : "outline"}
                color={donationEnabled ? "green" : "red"}
                onClick={async () => {
                  try {
                    await toggle.mutateAsync({ enabled: !donationEnabled }); // 👈 use mutateAsync
                    await refetch(); // refresh donation status after toggle
                  } catch (err) {
                    console.error("Toggle failed:", err);
                  }
                }}

                leftSection={
                  donationEnabled ? <IconCheck size={16} /> : <IconX size={16} />
                }
              >
                {donationEnabled ? "Disable Blood Donation" : "Enable Blood Donation"}
              </Button>
            )}
            <Divider my="xs" />
            <Text size="sm" c="dimmed" ta="center" mt="md">
              <strong>Note:</strong> Booking an appointment here only schedules
              your request. You will still need to fill up the official onsite
              form when you arrive for blood donation or blood request
              processing.
            </Text>
          </Stack>
        </Paper>

        {/* Right side - Sticky Notes */}
        <Box
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "column",
            gap: "1.5rem",
            width: isMobile ? "100%" : 260,
          }}
        >
          {[
            {
              color: "#1565c0",
              text: `“OLFU RCY Blood Donation is available only every 3 months during the official OLFU RCY blood donation drive.\n 
                OLFU RCY Blood Request scheduling is available only Monday to Friday, 8:00 AM – 5:00 PM. 
                For Blood Request, if you book an appointment beyond these hours, OLFU RCY may not respond immediately. 
                Your request will likely be addressed on the next working day.”`,
              rotate: "-2deg",
            },
          ].map((note, i) => (
            <Paper
              key={i}
              shadow="xl"
              p="md"
              style={{
                backgroundColor: "#fffef9",
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0,0,0,0.1) 24px)",
                backgroundSize: "100% 24px",
                width: "100%",
                height: isMobile ? "auto" : 400,
                textAlign: "center",
                transform: `rotate(${note.rotate})`,
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
                  color: note.color,
                  filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.6))",
                }}
              />
              <Text fw={600} size="sm" mt="xl" c="black" style={{ whiteSpace: "pre-line"}}>
                {note.text}
              </Text>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
