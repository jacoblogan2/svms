export const verifyEmailTemplate = (verificationLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Verify your Email</h2>
      <p style="color: #555; font-size: 16px;">
        Thank you for joining SVMS! Please click the button below to verify your account and get started.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" 
           style="padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
           Verify Email
        </a>
      </div>
      <p style="color: #777; font-size: 14px; text-align: center;">
        If you didn't create an account with us, you can safely ignore this email.
      </p>
      <hr style="border: 0; border-top: 1px solid #eee;">
      <p style="color: #aaa; font-size: 12px; text-align: center;">
        &copy; 2026 SVMS Team. All rights reserved.
      </p>
    </div>
  `;
};
