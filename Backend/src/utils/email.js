import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Password Reset Request",
    html: `
      <h2>You requested a password reset</h2>
      <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #FF7D44; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

const getEmailHeader = (title) => `
  <div style="font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
    <div style="text-align: center; padding-bottom: 20px; border-b: 1px solid rgba(255,255,255,0.1);">
      <h1 style="color: #FF7D44; margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.05em;">FEASTIFY</h1>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Premium Catering & Event Management</p>
    </div>
    <div style="padding: 24px 0;">
      <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0;">${title}</h2>
`;

const getEmailFooter = () => `
    </div>
    <div style="border-t: 1px solid rgba(255,255,255,0.1); padding-top: 16px; text-align: center; font-size: 11px; color: #64748b;">
      <p style="margin: 0;">Thank you for trusting Feastify for your special events!</p>
      <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} Feastify Inc. All rights reserved.</p>
    </div>
  </div>
`;

// 1. New Booking Notification
export const sendBookingCreatedEmail = async ({ booking, user, vendor }) => {
  try {
    const shortId = booking._id.toString().slice(-6).toUpperCase();
    const eventDateStr = new Date(booking.eventDate).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Email to Customer
    if (user?.email) {
      await transporter.sendMail({
        from: `Feastify <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Feastify - Booking Request Received (#${shortId})`,
        html: `
          ${getEmailHeader(`Booking Request Sent! 🍽️`)}
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hi <strong>${user.name || "Valued Customer"}</strong>,</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Your booking enquiry for <strong>${booking.category}</strong> has been sent to <strong>${vendor?.name || "the caterer"}</strong>. They will review your request shortly.</p>
          
          <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Booking Reference:</strong> #${shortId}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Event Date:</strong> ${eventDateStr}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Guest Count:</strong> ${booking.guestCount} guests</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Venue:</strong> ${booking.venueLocation}</p>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px;">Once the caterer accepts your booking, you can proceed with the 50% advance deposit payment to confirm your date.</p>
          ${getEmailFooter()}
        `,
      });
      console.log(`Booking created email sent to customer: ${user.email}`);
    }

    // Email to Vendor
    if (vendor?.email) {
      await transporter.sendMail({
        from: `Feastify <${process.env.EMAIL_USER}>`,
        to: vendor.email,
        subject: `Feastify - New Booking Request from ${user?.name || "Customer"} (#${shortId})`,
        html: `
          ${getEmailHeader(`New Catering Request Received! 🎉`)}
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hello <strong>${vendor.name}</strong>,</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">You have received a new booking enquiry for your catering service <strong>${booking.category}</strong>.</p>
          
          <div style="background-color: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Client Name:</strong> ${user?.name || "Customer"}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Client Email:</strong> ${user?.email || "N/A"}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Event Date:</strong> ${eventDateStr}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Expected Guests:</strong> ${booking.guestCount}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #94a3b8;"><strong>Venue Address:</strong> ${booking.venueLocation}</p>
          </div>

          <p style="color: #cbd5e1; font-size: 13px;">Please log in to your vendor dashboard to Accept or Reject this booking.</p>
          ${getEmailFooter()}
        `,
      });
      console.log(`Booking request email sent to vendor: ${vendor.email}`);
    }
  } catch (error) {
    console.error("Error sending booking created emails:", error);
  }
};

// 2. Booking Status Update Email
export const sendBookingStatusEmail = async ({ booking, user, vendor }) => {
  try {
    if (!user?.email) return;

    const shortId = booking._id.toString().slice(-6).toUpperCase();
    const isAccepted = booking.status === "Accepted" || booking.status === "Confirmed";

    await transporter.sendMail({
      from: `Feastify <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Feastify - Booking #${shortId} Status Updated: ${booking.status}`,
      html: `
        ${getEmailHeader(`Booking Status Updated 📋`)}
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hi <strong>${user.name || "Customer"}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">The status of your booking with <strong>${vendor?.name || "your caterer"}</strong> has been updated to:</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; padding: 10px 24px; border-radius: 30px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; ${
            isAccepted ? "background-color: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.4);" : "background-color: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.4);"
          }">
            ${booking.status}
          </span>
        </div>

        ${
          isAccepted
            ? `<p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Great news! Your booking is accepted. Please log in to your Feastify account and click <strong>Pay Deposit</strong> to pay the 50% advance and lock in your event date.</p>`
            : `<p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">We regret to inform you that your booking request could not be accepted at this time.</p>`
        }
        ${getEmailFooter()}
      `,
    });
    console.log(`Booking status email sent to customer: ${user.email}`);
  } catch (error) {
    console.error("Error sending booking status email:", error);
  }
};

// 3. Payment Receipt Email (Advance Deposit)
export const sendPaymentReceiptEmail = async ({ booking, user, vendor }) => {
  try {
    const shortId = booking._id.toString().slice(-6).toUpperCase();
    const paidAmount = booking.paymentDetails?.paidAmount || 0;
    const paymentId = booking.paymentDetails?.paymentId || "N/A";
    const paidAtStr = new Date(booking.paymentDetails?.paidAt || Date.now()).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (user?.email) {
      await transporter.sendMail({
        from: `Feastify <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Feastify - 50% Deposit Payment Confirmed! (#${shortId})`,
        html: `
          ${getEmailHeader(`Payment Receipt & Booking Confirmed! ✅`)}
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hi <strong>${user.name || "Customer"}</strong>,</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">We have successfully received your 50% advance deposit. Your catering booking is now <strong>CONFIRMED</strong>!</p>
          
          <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); padding: 18px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;"><strong>Transaction ID:</strong> ${paymentId}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;"><strong>Amount Paid:</strong> ₹${paidAmount}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;"><strong>Payment Date:</strong> ${paidAtStr}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;"><strong>Booking Status:</strong> Confirmed</p>
          </div>

          <p style="color: #94a3b8; font-size: 13px;">The caterer <strong>${vendor?.name || "Service Provider"}</strong> has been notified of your payment.</p>
          ${getEmailFooter()}
        `,
      });
      console.log(`Payment receipt email sent to customer: ${user.email}`);
    }

    if (vendor?.email) {
      await transporter.sendMail({
        from: `Feastify <${process.env.EMAIL_USER}>`,
        to: vendor.email,
        subject: `Feastify - Advance Deposit Received for Booking #${shortId}`,
        html: `
          ${getEmailHeader(`Advance Deposit Received! 💰`)}
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hello <strong>${vendor.name}</strong>,</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">The client <strong>${user?.name || "Customer"}</strong> has paid the 50% advance deposit of <strong>₹${paidAmount}</strong> for booking #${shortId}.</p>
          <p style="color: #94a3b8; font-size: 13px;">This booking is now officially confirmed in your schedule.</p>
          ${getEmailFooter()}
        `,
      });
      console.log(`Payment notification email sent to vendor: ${vendor.email}`);
    }
  } catch (error) {
    console.error("Error sending payment receipt email:", error);
  }
};

// 4. Full Payment Settlement Email
export const sendSettlementEmail = async ({ booking, user, vendor }) => {
  try {
    if (!user?.email) return;
    const shortId = booking._id.toString().slice(-6).toUpperCase();

    await transporter.sendMail({
      from: `Feastify <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Feastify - Booking #${shortId} Fully Settled!`,
      html: `
        ${getEmailHeader(`Booking Settlement Complete! 🎉`)}
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hi <strong>${user.name || "Customer"}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Your booking with <strong>${vendor?.name || "the caterer"}</strong> has been marked as <strong>Fully Paid</strong>.</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Thank you for choosing Feastify to host your event. We hope you had a fantastic experience!</p>
        ${getEmailFooter()}
      `,
    });
    console.log(`Settlement email sent to customer: ${user.email}`);
  } catch (error) {
    console.error("Error sending settlement email:", error);
  }
};
