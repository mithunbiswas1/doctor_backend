// ael_backend/src/utils/email.service.js
import nodemailer from "nodemailer";

/**
 * Creates and returns a configured Nodemailer transporter
 */
export const getMailTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";

  // If no credentials configured yet, return null
  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends a generic email
 */
export const sendMail = async ({ to, bcc, subject, html, text }) => {
  const fromName = process.env.SMTP_FROM_NAME || "AEL SafeLPG Bangladesh";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "newsletter@safelpg.com";
  const fromAddress = `"${fromName}" <${fromEmail}>`;

  const transporter = getMailTransporter();

  if (!transporter) {
    return {
      success: true,
      simulated: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const mailOptions = {
      from: fromAddress,
      subject,
      ...(to && { to }),
      ...(bcc && { bcc }),
      ...(html && { html }),
      text: text || "AEL SafeLPG Newsletter Notification",
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Formats a clean HTML email template for new content broadcasts
 */
export const buildNewsletterHtml = ({
  badgeText,
  titleEn,
  titleBn,
  summaryEn,
  summaryBn,
  ctaText,
  ctaUrl,
  imageUrl,
  recipientEmail = "",
}) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
  const fullCtaUrl = ctaUrl.startsWith("http") ? ctaUrl : `${frontendUrl}${ctaUrl}`;
  const unsubscribeUrl = recipientEmail
    ? `${frontendUrl}/newsletter/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${frontendUrl}/newsletter/unsubscribe`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleEn || "AEL SafeLPG Newsletter"}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #22081f; padding: 28px 32px; text-align: left; border-bottom: 2px solid #d4a373;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">
                      AEL <span style="color: #d4a373;">SAFELPG</span>
                    </span>
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 500; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Bangladesh LPG Safety & Regulatory Platform
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <!-- Category Badge -->
              <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px; margin-bottom: 16px;">
                ${badgeText || "NEW UPDATE"}
              </div>

              <!-- Title English -->
              <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; line-height: 1.35; color: #0f172a;">
                ${titleEn}
              </h1>

              <!-- Title Bangla -->
              ${
                titleBn && titleBn !== titleEn
                  ? `<h2 style="margin: 0 0 16px 0; font-size: 17px; font-weight: 700; line-height: 1.4; color: #334155;">${titleBn}</h2>`
                  : `<div style="margin-bottom: 16px;"></div>`
              }

              <!-- Image if provided -->
              ${
                imageUrl
                  ? `<div style="margin: 16px 0 20px 0; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                      <img src="${imageUrl}" alt="${titleEn}" style="width: 100%; max-height: 280px; object-fit: cover; display: block;" />
                     </div>`
                  : ""
              }

              <!-- Summary Paragraphs -->
              ${
                summaryEn
                  ? `<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #475569;">${summaryEn}</p>`
                  : ""
              }
              ${
                summaryBn
                  ? `<p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">${summaryBn}</p>`
                  : `<div style="margin-bottom: 24px;"></div>`
              }

              <!-- Action Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 8px; margin-bottom: 8px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #22081f;">
                    <a href="${fullCtaUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; border: 1px solid #22081f;">
                      ${ctaText || "View Details on Website"} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="border-top: 1px solid #f1f5f9;"></div>
            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #f8fafc; text-align: left; font-size: 12px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #334155;">
                You are receiving this update because you are subscribed to the AEL SafeLPG Newsletter.
              </p>
              <p style="margin: 0 0 12px 0;">
                To manage your preferences or unsubscribe, please visit your account dashboard or <a href="${unsubscribeUrl}" target="_blank" style="color: #0f172a; text-decoration: underline; font-weight: 600;">click to unsubscribe</a>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} AEL SafeLPG Bangladesh. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Builds a professional HTML invoice/receipt email for course purchases and subscription activations
 */
export const buildPurchaseInvoiceHtml = ({
  transactionId,
  customerName,
  customerPhone,
  customerEmail,
  companyName,
  planOrCourseTitle,
  type = "subscription", // "subscription" | "course"
  billingCycle = "monthly",
  amount = 0,
  vat = 0,
  grandTotal = 0,
  paymentMethod = "Online",
  paymentGateway = "SSLCommerz / bKash",
  bankTranId = "",
  startDate = new Date(),
  expiryDate,
}) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
  const dashboardUrl = `${frontendUrl}/user-dashboard`;
  const formattedDate = new Date(startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const expiryStr = expiryDate
    ? new Date(expiryDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Lifetime Access";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${transactionId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Top Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; color: #ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #38bdf8; text-transform: uppercase;">
                      AEL SafeLPG Bangladesh
                    </div>
                    <div style="font-size: 20px; font-weight: 900; color: #ffffff; margin-top: 4px;">
                      Official Payment Receipt
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; font-size: 11px; font-weight: 800; padding: 6px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ● PAID / পরিশোধিত
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Invoice Metadata Summary -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 12px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                      Invoice / Transaction ID:
                    </div>
                    <div style="font-size: 13px; font-weight: 800; font-family: monospace; color: #0284c7; margin-top: 2px;">
                      ${transactionId}
                    </div>
                    ${bankTranId ? `
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                      Gateway Ref: <strong>${bankTranId}</strong>
                    </div>` : ""}
                  </td>
                  <td width="50%" align="right" style="vertical-align: top; padding-left: 12px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                      Payment Date:
                    </div>
                    <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-top: 2px;">
                      ${formattedDate}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Billed To Section -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #f1f5f9;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 8px;">
                Billed To / গ্রাহকের বিবরণ:
              </div>
              <div style="font-size: 15px; font-weight: 800; color: #0f172a;">
                ${customerName || "Valued Customer"}
              </div>
              ${companyName ? `<div style="font-size: 12px; font-weight: 600; color: #475569; margin-top: 2px;">${companyName}</div>` : ""}
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                ${customerPhone ? `Mobile: <strong style="color: #334155;">${customerPhone}</strong>` : ""}
                ${customerEmail ? ` &bull; Email: <strong style="color: #334155;">${customerEmail}</strong>` : ""}
              </div>
            </td>
          </tr>

          <!-- Itemized Breakdown Table -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #e2e8f0;">
                    <th align="left" style="padding-bottom: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">
                      Item / Plan Description
                    </th>
                    <th align="center" style="padding-bottom: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">
                      Access Validity
                    </th>
                    <th align="right" style="padding-bottom: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">
                      Amount (BDT)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 16px 0; vertical-align: top;">
                      <div style="font-size: 14px; font-weight: 800; color: #0f172a;">
                        ${planOrCourseTitle}
                      </div>
                      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                        ${type === "course" ? "Individual Course Enrollment" : `Membership Tier &bull; ${billingCycle}`}
                      </div>
                    </td>
                    <td align="center" style="padding: 16px 8px; vertical-align: top; font-size: 12px; font-weight: 600; color: #0284c7;">
                      ${expiryStr}
                    </td>
                    <td align="right" style="padding: 16px 0; vertical-align: top; font-size: 14px; font-weight: 800; color: #0f172a;">
                      ${amount === 0 ? "FREE" : `৳ ${Number(amount).toLocaleString()}`}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Totals Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                <tr>
                  <td width="60%"></td>
                  <td width="40%">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 4px 0; font-size: 12px; color: #64748b;">Subtotal:</td>
                        <td align="right" style="padding: 4px 0; font-size: 12px; font-weight: 700; color: #1e293b;">
                          ${amount === 0 ? "FREE" : `৳ ${Number(amount).toLocaleString()}`}
                        </td>
                      </tr>
                      ${vat > 0 ? `
                      <tr>
                        <td style="padding: 4px 0; font-size: 12px; color: #64748b;">VAT (0%):</td>
                        <td align="right" style="padding: 4px 0; font-size: 12px; font-weight: 700; color: #1e293b;">
                          ৳ ${Number(vat).toLocaleString()}
                        </td>
                      </tr>` : ""}
                      <tr style="border-top: 2px solid #0f172a;">
                        <td style="padding: 10px 0; font-size: 14px; font-weight: 900; color: #0f172a;">
                          Grand Total:
                        </td>
                        <td align="right" style="padding: 10px 0; font-size: 18px; font-weight: 900; color: #059669;">
                          ${grandTotal === 0 ? "FREE" : `৳ ${Number(grandTotal).toLocaleString()}`}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Method Note -->
              <div style="margin-top: 20px; padding: 12px 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
                <strong>Payment Method:</strong> ${paymentMethod} (${paymentGateway}) &bull; Status: Verified & Completed.
              </div>

              <!-- CTA Button -->
              <div style="margin-top: 28px; text-align: center;">
                <a href="${dashboardUrl}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 13px; font-weight: 800; letter-spacing: 0.3px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);">
                  Access Learning Dashboard &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td style="padding: 20px 32px 28px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">
                Need help or have billing inquiries?
              </p>
              <p style="margin: 0 0 10px 0;">
                Reach our emergency helpline at <strong>+880 1700-000000</strong> or reply directly to this email at <strong>info@safelpg.com</strong>.
              </p>
              <p style="margin: 0; font-size: 10px; color: #cbd5e1;">
                &copy; ${new Date().getFullYear()} AEL SafeLPG Bangladesh. All rights reserved. Dhaka, Bangladesh.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Dispatches an automated invoice email to the customer upon purchase or enrollment
 */
export const sendPurchaseInvoiceEmail = async (invoicePayload) => {
  const recipientEmail =
    invoicePayload.customerEmail ||
    invoicePayload.customerDetails?.email ||
    invoicePayload.user?.email ||
    invoicePayload.email;

  if (!recipientEmail || !recipientEmail.includes("@")) {
    return { success: false, reason: "No valid recipient email provided" };
  }

  try {
    const html = buildPurchaseInvoiceHtml({
      transactionId: invoicePayload.transactionId,
      customerName: invoicePayload.customerName || invoicePayload.customerDetails?.fullName,
      customerPhone: invoicePayload.customerPhone || invoicePayload.customerDetails?.phone,
      customerEmail: recipientEmail,
      companyName: invoicePayload.companyName || invoicePayload.customerDetails?.companyName,
      planOrCourseTitle: invoicePayload.planOrCourseTitle || invoicePayload.planName,
      type: invoicePayload.type || "subscription",
      billingCycle: invoicePayload.billingCycle,
      amount: invoicePayload.amount || invoicePayload.grandTotal || 0,
      vat: invoicePayload.vat || 0,
      grandTotal: invoicePayload.grandTotal || invoicePayload.amount || 0,
      paymentMethod: invoicePayload.paymentMethod,
      paymentGateway: invoicePayload.paymentGateway,
      bankTranId: invoicePayload.bankTranId,
      startDate: invoicePayload.startDate || new Date(),
      expiryDate: invoicePayload.expiryDate,
    });

    const subject = `[Receipt] Payment Confirmation & Invoice for ${invoicePayload.planOrCourseTitle || invoicePayload.planName} (${invoicePayload.transactionId})`;

    return await sendMail({
      to: recipientEmail,
      subject,
      html,
      text: `Your payment of BDT ${invoicePayload.grandTotal || invoicePayload.amount || 0} has been processed successfully. Transaction ID: ${invoicePayload.transactionId}. Plan/Course: ${invoicePayload.planOrCourseTitle || invoicePayload.planName}. Visit ${process.env.FRONTEND_URL || "http://localhost:3000"}/user-dashboard to start.`,
    });
  } catch (err) {
    console.warn(`[InvoiceEmail] Failed to deliver invoice to ${recipientEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

