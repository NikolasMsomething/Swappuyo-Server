/**
 * For configuration, we will rely on process.env, a NodeJS global. To learn more:
 * https://codeburst.io/process-env-what-it-is-and-why-when-how-to-use-it-effectively-505d0b2831e7
 */

module.exports = {
  // We use the OR ("||") operator to check if the PORT environment variable exists. If not, we default to 8080
  PORT: process.env.PORT || 8080,
  clientId: process.env.clientId || 'jMNgm9tZ6e0Kig',
  clientSecret: process.env.clientSecret || 'qVBQ3qeJfe6NzYCMwY8aDh2oCoI',
  redditRedirect:
		process.env.redditRedirect || 'http://localhost:3000/RedditTokenRedirect',
  HTTP_STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/swappuyo',
  TEST_MONGO_URL:
		process.env.TEST_MONGO_URL || 'mongodb://localhost:27017/test-swappuyo',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secretestsecretever',
  JWT_SECRET: process.env.JWT_SECRET || 'default',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
