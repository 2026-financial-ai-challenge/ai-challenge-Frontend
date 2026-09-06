const backend = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  async headers() {
    return [
      {
        source: "/cs",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/cs/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${backend}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
