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

interface NewBookingAlertEmailProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  venueName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  notes?: string;
  dashboardUrl: string;
}

export function NewBookingAlertEmail({
  guestName,
  guestEmail,
  guestPhone,
  venueName,
  eventDate,
  eventType,
  guestCount,
  notes,
  dashboardUrl,
}: NewBookingAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New booking request from {guestName} for {venueName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Venora</Heading>
          <Heading as="h2" style={subheading}>
            New Booking Request
          </Heading>
          <Text style={text}>
            A new booking request has been submitted for{" "}
            <strong>{venueName}</strong>. Review and respond in your dashboard.
          </Text>
          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Guest:</strong> {guestName}
            </Text>
            <Text style={detailRow}>
              <strong>Email:</strong> {guestEmail}
            </Text>
            <Text style={detailRow}>
              <strong>Phone:</strong> {guestPhone}
            </Text>
            <Text style={detailRow}>
              <strong>Date:</strong> {eventDate}
            </Text>
            <Text style={detailRow}>
              <strong>Event Type:</strong> {eventType}
            </Text>
            <Text style={detailRow}>
              <strong>Guest Count:</strong> {guestCount}
            </Text>
            {notes && (
              <Text style={detailRow}>
                <strong>Notes:</strong> {notes}
              </Text>
            )}
          </Section>
          <Button style={button} href={dashboardUrl}>
            Review in Dashboard
          </Button>
          <Hr style={hr} />
          <Text style={footer}>Powered by Venora</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default NewBookingAlertEmail;

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
