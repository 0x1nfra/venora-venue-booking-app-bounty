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

interface BookingStatusChangedEmailProps {
  guestName: string;
  venueName: string;
  eventDate: string;
  eventType: string;
  status: "approved" | "rejected";
  publicToken: string;
  appUrl: string;
}

export function BookingStatusChangedEmail({
  guestName,
  venueName,
  eventDate,
  eventType,
  status,
  publicToken,
  appUrl,
}: BookingStatusChangedEmailProps) {
  const statusUrl = `${appUrl}/booking/${publicToken}`;
  const isApproved = status === "approved";

  return (
    <Html>
      <Head />
      <Preview>
        Your booking for {venueName} has been {status}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Venora</Heading>
          <Heading as="h2" style={subheading}>
            Booking {isApproved ? "Approved" : "Rejected"}
          </Heading>
          <Text style={text}>Hi {guestName},</Text>
          <Text style={text}>
            {isApproved
              ? `Great news! Your booking request for ${venueName} has been approved. We look forward to hosting your event.`
              : `Unfortunately, your booking request for ${venueName} has been rejected. Please contact the venue directly if you have any questions.`}
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
            <Text style={{ ...detailRow, color: isApproved ? "#059669" : "#dc2626", fontWeight: "600" }}>
              <strong>Status:</strong> {isApproved ? "Approved" : "Rejected"}
            </Text>
          </Section>
          <Button style={isApproved ? buttonApproved : buttonRejected} href={statusUrl}>
            View Booking Details
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            Powered by Venora · If you have questions, please contact the venue directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingStatusChangedEmail;

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

const buttonApproved = {
  backgroundColor: "#059669",
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

const buttonRejected = {
  backgroundColor: "#6b7280",
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
