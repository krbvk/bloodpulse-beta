"use client";
import { Box, Title, Accordion, ScrollArea, Divider, Text, Anchor, Stack } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

const Faq = () => {
  const faqs = [
    {
      q: "Can I use the website on my phone?",
      a: "Yes, it works on Android, iOS, and Desktop.",
    },
    {
      q: "Can I cancel my appointment?",
      a: "Once you receive a reply for your appointment request, you can respond to that email to cancel or modify your appointment details such as time or date.",
    },
    {
      q: "How to delete my account and data?",
      a: "Contact support to request account and data deletion.",
    },
    {
      q: "How do I know if my appointment was approved?",
      a: "You will receive a confirmation or reschedule notice via email once your appointment request has been reviewed by the Red Cross Youth coordinator.",
    },
    {
      q: "Who can donate blood?",
      a: "Anyone in good health, aged 18 and above, weighing at least 50 kilograms, with normal blood pressure and hemoglobin count, can register as a donor following Philippine Red Cross (2023) guidelines.",
    },
    {
      q: "Is my personal data safe on Bloodpulse?",
      a: "Yes. All information is encrypted and protected under the Data Privacy Act of 2012 (RA 10173). Only authorized administrators can access donor or recipient details.",
    },
    {
      q: "Can I see if my blood type is currently needed?",
      a: "Yes. You can view announcements or the “Most Needed Blood Type” section under the Statistics tab, which updates based on donation drives and requests.",
    },
    {
      q: "Can I register as both a donor and a requester?",
      a: "Yes. You may create one account and use it for both donating and requesting blood as long as you meet the eligibility requirements.",
    },
    {
      q: "Is there any payment or reward for donating?",
      a: "No. Blood donation through Bloodpulse is voluntary and non-monetary, following Red Cross principles. No points, promotions, or financial incentives are provided.",
    },
    {
      q: "How often can I donate blood?",
      a: "You can donate again after a minimum of three months from your last donation, based on Red Cross guidelines.",
    },
    {
      q: "What should I do if I entered the wrong information on my profile?",
      a: "You can update your personal details in the User Profile section by clicking the Edit Profile button.",
    },
    {
      q: "Why can’t I see available donation dates?",
      a: "Blood donation booking opens only when the administrator enables donation events. You will be notified via email when new drives are available.",
    },
    {
      q: "What if I experience issues logging in or booking an appointment?",
      a: "You can contact the Bloodpulse support team through the Contact and Support section or by emailing the administrator directly.",
    },
  ];

  return (
    <Box
      style={{
        marginTop: "5%",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #fff 0%, #fff5f5 40%, #ffe5e5 100%)",
        padding: "2rem",
      }}
    >
      <Title
        order={1}
        style={{
          color: "#b71c1c",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2rem",
          letterSpacing: "0.3px",
        }}
      >
        Frequently Asked Questions
      </Title>

      <ScrollArea
        type="hover"
        style={{
          height: "70vh",
          width: "90%",
          maxWidth: "850px",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#fff",
          padding: "1.5rem 2rem",
          border: "1px solid #f3f3f3",
        }}
      >
        <Accordion
          variant="separated"
          transitionDuration={250}
          radius="md"
          styles={{
            item: {
              marginBottom: "1rem",
              border: "1px solid #f0f0f0",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              transition: "all 0.3s ease",
            },
            control: {
              backgroundColor: "#fff",
              color: "black",
              fontWeight: 600,
              fontSize: "1.05rem",
              padding: "1rem 1.25rem",
              transition: "background-color 0.2s ease, color 0.2s ease",
            },
            panel: {
              padding: "0.75rem 1.25rem 1rem",
              color: "#dd3737ff",
              fontSize: "1rem",
              lineHeight: 1.6,
              backgroundColor: "#fff9f9",
            },
          }}
        >
          {faqs.map((faq, index) => (
            <Accordion.Item key={index} value={`faq-${index}`}>
              <Accordion.Control>{faq.q}</Accordion.Control>
              <Accordion.Panel>{faq.a}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Divider my="xl" />

        {/* Contact & Support Section */}
        <Stack gap="xs" align="center">
          <Title
            order={3}
            style={{
              color: "#b71c1c",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Contact and Support
          </Title>

          <Text size="sm" color="dimmed" style={{ textAlign: "center", maxWidth: "600px" }}>
            Need help or have questions? You can reach us at the email below.
          </Text>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <IconMail color="#b71c1c" size={20} />
            <Anchor
              href="mailto:bdodchigue8776val@student.fatima.edu.ph"
              underline="hover"
              style={{ color: "#b71c1c", fontWeight: 600 }}
            >
              bdodchigue8776val@student.fatima.edu.ph
            </Anchor>
          </Box>
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default Faq;
