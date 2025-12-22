/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://3.253.103.5:8080/api/openai/create",
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
