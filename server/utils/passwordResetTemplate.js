const passwordResetTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9fafb;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #3b82f6; margin-bottom: 5px;">TaskHero</h1>
      <p style="font-size: 18px; color: #374151; margin-top: 0;">Password Reset</p>
    </div>
    
    <div style="margin-bottom: 30px; line-height: 1.5;">
      <p>Dear ${name},</p>
      <p>We received a request to reset your password. Use the following OTP code to proceed with your password reset:</p>
    </div>
    
    <div style="background-color: #e5edff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <h2 style="font-size: 30px; letter-spacing: 5px; color: #1f2937; margin: 0; font-weight: 800;">${otp}</h2>
    </div>
    
    <div style="line-height: 1.5;">
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
      <p style="margin-top: 20px;">Thank you,<br>TaskHero Team</p>
    </div>
    
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
  `;
};

export default passwordResetTemplate;