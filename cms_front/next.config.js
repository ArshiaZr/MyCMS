/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {},
  // publicRuntimeConfig: {
  //   SERVER_URL: process.env.SERVER_URL,
  //   SERVER_MANAGEMENT_URL: process.env.SERVER_MANAGEMENT_URL,
  // },
  publicRuntimeConfig: {
    SERVER_URL: "http://localhost:5001",
    SERVER_MANAGEMENT_URL: "http://localhost:5001/panel",
  },
};

module.exports = nextConfig;
