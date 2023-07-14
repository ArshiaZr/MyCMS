/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    SERVER_URL: process.env.SERVER_URL,
    SERVER_MANAGEMENT_URL: process.env.SERVER_MANAGEMENT_URL,
  },
  // publicRuntimeConfig: {
  //   SERVER_URL: "http://172.105.20.221/",
  //   SERVER_MANAGEMENT_URL: "http://172.105.20.221/api/v1/management",
  // },
};

module.exports = nextConfig;
