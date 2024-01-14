import * as process from 'process';

export const globalConfig = () => ({
  port: +process.env.PORT || 3000,
  emailVerifyTokenTtl: +process.env.EMAIL_VERIFY_TOKEN_TTL || 30,
  emailVerifyEndpoint:
    process.env.EMAIL_VERIFY_ENDPOINT || '/api/v1/email/verify',
  passwordResetTokenTtl: +process.env.PASSWORD_RESET_TOKEN_TTL || 30,
  passwordResetEndpoint:
    process.env.PASSWORD_RESET_ENDPOINT || '/api/v1/password/reset',
});
