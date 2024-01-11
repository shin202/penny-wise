export const globalConfig = () => ({
  port: +process.env.PORT || 3000,
  emailVerifyTokenTtl: +process.env.EMAIL_VERIFY_TOKEN_TTL || 30,
  emailVerifyEndpoint:
    process.env.EMAIL_VERIFY_ENDPOINT || '/api/v1/email/verify',
});
