import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BookingSubmittedEmailProps {
  guestName: string;
  venueName: string;
  eventDate: string;
  eventType: string;
  publicToken: string;
  appUrl: string;
}

export function BookingSubmittedEmail({
  guestName,
  venueName,
  eventDate,
  eventType,
  publicToken,
  appUrl,
}: BookingSubmittedEmailProps) {
  const statusUrl = `${appUrl}/booking/${publicToken}`;

  return (
    <Html>
      <Head />
      <Preview>Your booking request for {venueName} has been received</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Venora</Heading>
          <Heading as="h2" style={subheading}>
            Booking Request Received
          </Heading>
          <Text style={text}>Hi {guestName},</Text>
          <Text style={text}>
            We've received your booking request for <strong>{venueName}</strong>.
            The venue owner will review your request and get back to you shortly.
          </Text>
          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Venue:</strong> {venueName}
            </Text>
            <Text style={detailRow}>
              <strong>Date:</strong> {eventDate}
            </Text>
            <Text style={detailRow}>
              <strong>Event Type:</strong> {eventType}
            </Text>
            <Text style={detailRow}>
              <strong>Status:</strong> Pending Review
            </Text>
          </Section>
          <Text style={text}>
            You can check the status of your booking at any time using the link
            below:
          </Text>
          <Button style={button} href={statusUrl}>
            Check Booking Status
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Powered by Venora · If you didn't make this request, you can ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingSubmittedEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 32px",
  maxWidth: "560px",
  borderRadius: "8px",
  marginTop: "40px",
  marginBottom: "40px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#0f766e",
  margin: "0 0 8px",
};

const subheading = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 24px",
};

const text = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0 0 16px",
};

const detailsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px 20px",
  margin: "0 0 24px",
};

const detailRow = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#374151",
  margin: "0 0 6px",
};

const button = {
  backgroundColor: "#0f766e",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "0 0 24px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0 0 16px",
};

const footer = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#9ca3af",
  margin: "0",
};
