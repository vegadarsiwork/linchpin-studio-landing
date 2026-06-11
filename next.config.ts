import type { NextConfig } from "next";

const APP_URL = "https://app.linchpinstudios.in";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: APP_URL,
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: `${APP_URL}/:path*`,
        permanent: false,
      },
      {
        source: "/login",
        destination: `${APP_URL}/login`,
        permanent: false,
      },
      {
        source: "/app",
        destination: APP_URL,
        permanent: false,
      },
      {
        source: "/app/:path*",
        destination: `${APP_URL}/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
