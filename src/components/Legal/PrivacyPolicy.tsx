"use client";

import { Modal, ScrollArea, Text, Title, List } from "@mantine/core";

interface PrivacyPolicyProps {
  opened: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ opened, onClose }: PrivacyPolicyProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Privacy Policy — BloodPulse" size="lg" centered>
      <ScrollArea h={450} p="xs">
        <Text>
          This Privacy Policy describes how BloodPulse collects, uses, and protects your information.
        </Text>

        <Title order={4} mt="md">1. Information We Collect</Title>
        <List>
          <List.Item>Name, Email, Phone number</List.Item>
          <List.Item>Blood type and donor eligibility details</List.Item>
          <List.Item>Donation history</List.Item>
          <List.Item>Device and usage information</List.Item>
        </List>

        <Title order={4} mt="md">2. How We Use Your Data</Title>
        <List>
          <List.Item>To manage and verify your user account</List.Item>
          <List.Item>To help schedule and manage blood donation appointments</List.Item>
          <List.Item>To send reminders and important notifications</List.Item>
          <List.Item>To improve app experience and performance</List.Item>
        </List>

        <Title order={4} mt="md">3. Data Sharing</Title>
        <Text>
          BloodPulse does not sell your data. Limited information may be shared with partner blood banks
          only for appointment verification and safety screenings.
        </Text>

        <Title order={4} mt="md">4. Data Protection</Title>
        <Text>
          We use encryption and security measures to protect user data.  
          However, no digital system is completely secure.
        </Text>

        <Title order={4} mt="md">5. Your Rights</Title>
        <List>
          <List.Item>Request access to your personal data</List.Item>
          <List.Item>Correct or update information</List.Item>
          <List.Item>Request account deletion</List.Item>
          <List.Item>Withdraw consent at any time</List.Item>
        </List>

        <Title order={4} mt="md">6. Children’s Privacy</Title>
        <Text>
          This app is not intended for individuals under 18 unless permitted with guardian approval.
        </Text>

        <Title order={4} mt="md">7. Updates</Title>
        <Text>
          We may update this Privacy Policy. Continued use means you accept any changes.
        </Text>
      </ScrollArea>
    </Modal>
  );
}
