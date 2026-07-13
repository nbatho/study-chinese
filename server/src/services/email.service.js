import { env } from '../config/env.config.js';

// Resend REST API wrapper. No SDK dependency — a single POST endpoint is all we need.
// Without RESEND_API_KEY (e.g. local dev) emails are skipped and the action link is
// logged to the server console instead, so the full flow stays testable.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SEND_TIMEOUT_MS = 10_000;

export const isEmailDeliveryConfigured = () => Boolean(env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, devNote }) => {
  if (!isEmailDeliveryConfigured()) {
    console.info(`[email] RESEND_API_KEY chưa cấu hình — bỏ qua gửi "${subject}" tới ${to}.`);
    if (devNote) {
      console.info(`[email] (dev) ${devNote}`);
    }
    return { delivered: false, reason: 'missing_api_key' };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html
    }),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS)
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend API responded ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = await response.json().catch(() => ({}));
  return { delivered: true, id: data.id };
};

const emailLayout = (title, bodyHtml, buttonLabel, buttonUrl) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1e;">
    <div style="margin-bottom:24px;">
      <span style="display:inline-block;background:#d93f47;color:#fff;border-radius:12px;padding:8px 14px;font-weight:800;">Study Chinese</span>
    </div>
    <h1 style="font-size:22px;margin:0 0 12px;">${title}</h1>
    ${bodyHtml}
    <a href="${buttonUrl}"
       style="display:inline-block;margin:20px 0;background:#d93f47;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:12px 22px;">
      ${buttonLabel}
    </a>
    <p style="font-size:13px;color:#6b7280;line-height:1.6;">
      Nếu nút không hoạt động, hãy dán liên kết sau vào trình duyệt:<br/>
      <a href="${buttonUrl}" style="color:#d93f47;word-break:break-all;">${buttonUrl}</a>
    </p>
    <p style="font-size:12px;color:#9ca3af;margin-top:24px;">
      Nếu bạn không yêu cầu email này, bạn có thể bỏ qua nó.
    </p>
  </div>
`;

// OTP emails: the code is shown big and centered, no button.
const otpEmailLayout = (title, bodyHtml, code, ttlMinutes) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1a1a1e;">
    <div style="margin-bottom:24px;">
      <span style="display:inline-block;background:#d93f47;color:#fff;border-radius:12px;padding:8px 14px;font-weight:800;">Study Chinese</span>
    </div>
    <h1 style="font-size:22px;margin:0 0 12px;">${title}</h1>
    ${bodyHtml}
    <div style="margin:24px 0;text-align:center;">
      <span style="display:inline-block;background:#f4f4f5;border:1px solid #e4e4e7;border-radius:12px;padding:14px 28px;font-size:30px;font-weight:800;letter-spacing:10px;color:#1a1a1e;">${code}</span>
    </div>
    <p style="font-size:13px;color:#6b7280;line-height:1.6;">
      Mã có hiệu lực trong ${ttlMinutes} phút và chỉ dùng được một lần.
      Đừng chia sẻ mã này với bất kỳ ai.
    </p>
    <p style="font-size:12px;color:#9ca3af;margin-top:24px;">
      Nếu bạn không yêu cầu email này, bạn có thể bỏ qua nó — mật khẩu của bạn vẫn an toàn.
    </p>
  </div>
`;

export const sendVerificationEmail = (to, token) => {
  const actionUrl = `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to,
    subject: 'Xác thực email Study Chinese của bạn',
    devNote: `Link xác thực: ${actionUrl}`,
    html: emailLayout(
      'Xác thực địa chỉ email',
      `<p style="font-size:15px;line-height:1.6;color:#374151;">
         Cảm ơn bạn đã đăng ký Study Chinese! Nhấn nút bên dưới để xác thực địa chỉ email.
         Liên kết có hiệu lực trong ${env.EMAIL_VERIFICATION_TTL_HOURS} giờ.
       </p>`,
      'Xác thực email',
      actionUrl
    )
  });
};

export const sendPasswordResetOtpEmail = (to, code) =>
  sendEmail({
    to,
    subject: `${code} là mã đặt lại mật khẩu Study Chinese`,
    devNote: `Mã OTP đặt lại mật khẩu: ${code}`,
    html: otpEmailLayout(
      'Đặt lại mật khẩu',
      `<p style="font-size:15px;line-height:1.6;color:#374151;">
         Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
         Nhập mã bên dưới vào ứng dụng để tiếp tục.
       </p>`,
      code,
      env.OTP_TTL_MINUTES
    )
  });

export const sendChangePasswordOtpEmail = (to, code) =>
  sendEmail({
    to,
    subject: `${code} là mã xác nhận đổi mật khẩu Study Chinese`,
    devNote: `Mã OTP đổi mật khẩu: ${code}`,
    html: otpEmailLayout(
      'Xác nhận đổi mật khẩu',
      `<p style="font-size:15px;line-height:1.6;color:#374151;">
         Bạn (hoặc ai đó) vừa yêu cầu đổi mật khẩu tài khoản Study Chinese.
         Nhập mã bên dưới để xác nhận thao tác.
       </p>`,
      code,
      env.OTP_TTL_MINUTES
    )
  });
