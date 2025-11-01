"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import {
  IconCheck,
  IconMail,
  IconPin,
  IconX,
  IconSend,
} from "@tabler/icons-react";
import {
  Box,
  Title,
  Paper,
  Button,
  Notification,
  Stack,
  Select,
  Text,
  Divider,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { generateAppointmentMessage } from "@/utils/generateAppointmentMessage";

dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ Fixed time options (8 AM – 5 PM)
const timeOptions = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// ✅ Reason options for blood request
const causeOfBloodRequestOptions = [
  "Blood loss",
  "Defective production",
  "Destruction of blood cells",
  "Coagulation problems",
  "Medical treatments",
];

export default function AppointmentLayout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [subjectCount, setSubjectCount] = useState(1);
  const [subject, setSubject] = useState<
    "Blood Donation" | "Blood Request" | null
  >(null);
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [variant, setVariant] = useState<
    "whole blood" | "packed RBC" | "fresh plasma" | "frozen plasma" | null
  >(null);
  const [causeOfBloodRequest, setCauseOfBloodRequest] = useState<string | null>(
    null
  );
  const [location, setLocation] = useState("");
  const [urgentBloodType, setUrgentBloodType] = useState<string | null>(null);
  const [urgentLocation, setUrgentLocation] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <CustomLoader />;
  }

  // --- Donation toggle status ---
  const { data: donationEnabled, refetch } =
    api.donationControl.getStatus.useQuery();

  const toggle = api.donationControl.toggle.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const createAppointment = api.appointment.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setAppointmentDate(null);
      setAppointmentTime(null);
      setSubject(null);
      setBloodType(null);
      setVariant(null);
      setCauseOfBloodRequest(null);
      setSubjectCount((prev) => prev + 1);
    },
    onError: (error) => {
      setFailed(true);
      setSuccess(false);
      console.error("Error sending appointment request:", error);
    },
  });

  // --- Bulk email mutation ---
  const sendToAll = api.appointment.getAllUserEmails.useMutation({
    onSuccess: (res) => {
      alert(`✅ Email sent to ${res.sentTo.length} users`);
      setLocation("");
    },
    onError: (err) => {
      alert(`❌ Failed to send: ${err.message}`);
    },
  });

  // --- NEW: Urgent Blood Request Mutation ---
  const urgentEmail = api.appointment.sendUrgentBloodRequest.useMutation({
    onSuccess: (res) => {
      alert(`🚨 Urgent request sent to ${res.sentTo} users`);
      setUrgentBloodType(null);
      setUrgentLocation("");
    },
    onError: (err) => {
      alert(`❌ Failed to send urgent email: ${err.message}`);
    },
  });

  const handleUrgentSend = () => {
    if (!urgentBloodType || !urgentLocation.trim()) {
      alert("⚠️ Please fill out both blood type and location.");
      return;
    }
    urgentEmail.mutate({
      bloodType: urgentBloodType,
      location: urgentLocation,
    });
  };

  const handleSubmit = () => {
    if (!appointmentDate || !appointmentTime || !subject) return;
    if (
      subject === "Blood Request" &&
      (!bloodType || !variant || !causeOfBloodRequest)
    ) {
      setFailed(true);
      return;
    }

    const now = dayjs().tz("Asia/Manila");
    const datetime = dayjs(
      `${dayjs(appointmentDate).format("YYYY-MM-DD")} ${appointmentTime}`,
      "YYYY-MM-DD h:mm A"
    ).tz("Asia/Manila");

    if (datetime.isBefore(now)) {
      setTimeError("Selected time has already passed. Please choose a valid time.");
      setFailed(true);
      return;
    }

    if (
      subject === "Blood Donation" &&
      !dayjs(appointmentDate).isSame(dayjs(), "day")
    ) {
      setFailed(true);
      setTimeError("Blood Donation can only be booked for today.");
      return;
    }

    const formattedDate = dayjs(datetime).format("MMMM D, YYYY");
    const formattedTime = dayjs(datetime).format("hh:mm A");
    const generatedMessage = generateAppointmentMessage({
      subject,
      formattedDate,
      formattedTime,
    });

    const nextCount = subjectCount + 1;
    const displaySubject = `[${nextCount}] Appointment - ${subject}`;

    createAppointment.mutate({
      datetime: datetime.toDate(),
      subject,
      displaySubject,
      message: generatedMessage,
      bloodType: bloodType ?? undefined,
      variant: subject === "Blood Request" ? variant ?? undefined : undefined,
      causeOfBloodRequest:
        subject === "Blood Request" ? causeOfBloodRequest ?? undefined : undefined,
    });
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
            withCloseButton={false}
          >
            {donationEnabled
              ? "Blood Donation is open for today!"
              : "Blood Donation is currently unavailable. Please wait for the official OLFU RCY blood donation drive event."}
          </Notification>
        </Box>
      )}

      {/* Floating Notifications */}
      <Box
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {success && (
          <Notification
            icon={<IconCheck />}
            color="green"
            title="Request Sent"
            onClose={() => setSuccess(false)}
            withBorder
            radius="md"
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
            withBorder
            radius="md"
          >
            Failed to send appointment request. Please try again.
          </Notification>
        )}
      </Box>

      {/* Main layout */}
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
        {/* Left side - Form */}
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
            {/* Existing appointment form */}
            <DatePickerInput
              label="Date"
              placeholder="Select date"
              value={appointmentDate}
              onChange={(d) => {
                setAppointmentDate(d);
                setTimeError(null);
                setFailed(false);
              }}
              minDate={new Date()}
              maxDate={
                subject === "Blood Donation" && donationEnabled
                  ? new Date()
                  : undefined
              }
              withAsterisk
              clearable
              popoverProps={{ withinPortal: true }}
            />

            <Select
              label="Time"
              placeholder="Select time"
              data={timeOptions}
              value={appointmentTime}
              onChange={(value) => {
                setAppointmentTime(value);
                if (timeError) {
                  setTimeError(null);
                  setFailed(false);
                }
              }}
              withAsterisk
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
                const selected =
                  value as "Blood Donation" | "Blood Request" | null;
                setSubject(selected);
                if (selected === "Blood Donation" && donationEnabled) {
                  setAppointmentDate(new Date());
                }
              }}
              withAsterisk
            />

            {subject === "Blood Request" && (
              <>
                <Select
                  label="Blood Type"
                  placeholder="Select blood type"
                  data={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  value={bloodType}
                  onChange={setBloodType}
                  withAsterisk
                />

                <Select
                  label="Variant"
                  placeholder="Select variant"
                  data={[
                    "whole blood",
                    "packed RBC",
                    "fresh plasma",
                    "frozen plasma",
                  ]}
                  value={variant}
                  onChange={(v) =>
                    setVariant(
                      v as
                        | "whole blood"
                        | "packed RBC"
                        | "fresh plasma"
                        | "frozen plasma"
                        | null
                    ) ?? null
                  }
                  withAsterisk
                />

                <Select
                  label="Reason why you need blood"
                  placeholder="Select reason"
                  data={causeOfBloodRequestOptions}
                  value={causeOfBloodRequest}
                  onChange={(v) => setCauseOfBloodRequest(v)}
                  withAsterisk
                />
              </>
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
                (subject === "Blood Request" &&
                  (!bloodType || !variant || !causeOfBloodRequest))
              }
            >
              Send Appointment Request
            </Button>

            {/* Admin Panel */}
            {session?.user?.role === "ADMIN" && (
              <>
                <Button
                  variant={donationEnabled ? "filled" : "outline"}
                  color={donationEnabled ? "green" : "red"}
                  onClick={async () => {
                    try {
                      await toggle.mutateAsync({
                        enabled: !donationEnabled,
                      });
                      await refetch();
                    } catch (err) {
                      console.error("Toggle failed:", err);
                    }
                  }}
                  leftSection={
                    donationEnabled ? <IconCheck size={16} /> : <IconX size={16} />
                  }
                >
                  {donationEnabled
                    ? "Disable Blood Donation"
                    : "Enable Blood Donation"}
                </Button>

                {donationEnabled && (
                  <>
                    <Paper shadow="sm" radius="md" p="md" withBorder mb="md">
                      <Text fw={600} mb="sm">
                        Send Blood Donation Drive Invitation
                      </Text>
                      <TextInput
                        label="Location"
                        placeholder="Enter event location"
                        value={location}
                        onChange={(e) => setLocation(e.currentTarget.value)}
                        required
                      />
                      <Button
                        mt="md"
                        color="blue"
                        fullWidth
                        leftSection={<IconSend size={16} />}
                        onClick={() => {
                          if (!location.trim()) {
                            alert("⚠️ Please enter a location before sending.");
                            return;
                          }
                          sendToAll.mutate({ location });
                        }}
                        loading={sendToAll.status === "pending"}
                      >
                        Send Email To All Users
                      </Button>
                    </Paper>

                  {/* 🚨 Urgent Blood Request Section */}
{session?.user?.role === "ADMIN" && subject === "Blood Request" && (
  <Paper
    shadow="sm"
    radius="md"
    p="md"
    withBorder
    style={{
      borderColor: "red",
      borderWidth: "2px",
    }}
  >
    <Text fw={600} mb="sm" c="red">
      🚨 Send Urgent Blood Request
    </Text>
    <Select
      label="Blood Type Needed"
      placeholder="Select blood type"
      data={[
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ]}
      value={urgentBloodType}
      onChange={setUrgentBloodType}
      withAsterisk
    />
    <TextInput
      mt="sm"
      label="Location"
      placeholder="Enter urgent location"
      value={urgentLocation}
      onChange={(e) => setUrgentLocation(e.currentTarget.value)}
      required
    />
    <Button
      mt="md"
      color="red"
      fullWidth
      leftSection={<IconSend size={16} />}
      onClick={handleUrgentSend}
      loading={urgentEmail.status === "pending"}
    >
      Send Urgent Request To All Users
    </Button>
  </Paper>
)}

                  </>
                )}
              </>
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

        {/* Right side - Notes */}
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            width: isMobile ? "100%" : 260,
          }}
        >
          <Paper
            shadow="xl"
            p="md"
            style={{
              backgroundColor: "#fffef9",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 23px, rgba(0,0,0,0.1) 24px)",
              backgroundSize: "100% 24px",
              height: isMobile ? "auto" : 400,
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
            <Text
              fw={600}
              size="sm"
              mt="xl"
              c="black"
              style={{ whiteSpace: "pre-line" }}
            >
              “OLFU RCY Blood Donation is available only every 3 months during
              the official OLFU RCY blood donation drive.\n
              OLFU RCY Blood Request scheduling is available only Monday to
              Friday, 8:00 AM – 5:00 PM.”
            </Text>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
