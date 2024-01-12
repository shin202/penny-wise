export interface EmailVerifyPayload {
  token: string;
  email: string;
  username?: string;
}

export interface PasswordResetPayload {
  token: string;
  email: string;
  username?: string;
}

export type MailType = 'email-verification' | 'password-reset';

export interface EmailVerificationContext {
  username: string;
  verificationLink: string;
}

export interface PasswordResetContext {
  username: string;
  passwordResetLink: string;
}
