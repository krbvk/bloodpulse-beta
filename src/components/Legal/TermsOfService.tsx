"use client";

import { Modal, ScrollArea, Text, Title, List } from "@mantine/core";

interface TermsOfServiceProps {
  opened: boolean;
  onClose: () => void;
}

export default function TermsOfService({ opened, onClose }: TermsOfServiceProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Terms of Service — BloodPulse"
      size="lg"
      centered
      styles={{
        body: {
          overflowX: "hidden",
        },
      }}
    >
      <ScrollArea
        h={450}
        p="xs"
        type="scroll"
        offsetScrollbars
        scrollbars="y"
      >
        <Text>
          Welcome to <strong>BloodPulse: Blood Donor Portal & Blood Bank Booking Solution</strong>.  
          By using this service, you agree to these Terms of Service.
        </Text>

        <Title order={4} mt="md">1. Purpose of the Application</Title>
        <Text>
          BloodPulse assists users in scheduling blood donation appointments.  
          This app does <strong>not</strong> provide real-time or medical-grade data.
        </Text>

        <Title order={4} mt="md">2. Disclaimer</Title>
        <List>
          <List.Item>This app is <strong>not affiliated</strong> with the Philippine Red Cross.</List.Item>
          <List.Item>Affiliation only applies to <strong>OLFU Red Cross Youth</strong> for volunteer initiatives.</List.Item>
          <List.Item>Information such as supply counts may be delayed or inaccurate.</List.Item>
          <List.Item>Final donor approval is ALWAYS made by licensed medical personnel at the donation site.</List.Item>
        </List>

        <Title order={4} mt="md">3. User Responsibilities</Title>
        <List>
          <List.Item>Provide accurate personal and medical information.</List.Item>
          <List.Item>Use the app legally and ethically.</List.Item>
          <List.Item>Respect donation center schedules and rules.</List.Item>
        </List>

        <Title order={4} mt="md">4. Blood Donor Eligibility Restrictions</Title>
        <Text>You may NOT donate blood if you:</Text>
        <List>
          <List.Item>Have fever, colds, infection, or flu.</List.Item>
          <List.Item>Weigh below 50kg.</List.Item>
          <List.Item>Consumed alcohol within the last 24 hours.</List.Item>
          <List.Item>Are pregnant, breastfeeding, or recently gave birth.</List.Item>
          <List.Item>Had tattoo/piercing/microblading within 12 months.</List.Item>
          <List.Item>Have chronic illnesses such as cancer, epilepsy, hepatitis, HIV, or heart disease.</List.Item>
          <List.Item>Recently had surgery (within 6 months).</List.Item>
          <List.Item>Used illegal intravenous drugs.</List.Item>
        </List>

        <Title order={4} mt="md">5. Blood Expiration Policy</Title>
        <Text>
          Blood products have a limited lifespan. BloodPulse may display estimated supply
          stats, but they are <strong>not real-time</strong>. Actual availability depends on blood bank standards:
        </Text>
        <List>
          <List.Item><strong>Whole Blood:</strong> expires in 35–42 days.</List.Item>
          <List.Item><strong>Platelets:</strong> expire in 5–7 days.</List.Item>
          <List.Item><strong>Plasma:</strong> can last up to 1 year when frozen.</List.Item>
        </List>

        <Text mt="sm">
          Therefore, displayed units may no longer be viable even if the app shows available stock.
        </Text>

        <Title order={4} mt="md">6. Limitation of Liability</Title>
        <Text>
          BloodPulse is provided “as is” without warranties. We are not responsible for medical decisions,
          donor rejection, or inaccurate information displayed.
        </Text>

        <Title order={4} mt="md">7. Updates</Title>
        <Text>
          Terms may be updated. Continued use means you agree to any changes.
        </Text>
      </ScrollArea>
    </Modal>
  );
}
