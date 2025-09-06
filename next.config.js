/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'platform-lookaside.fbsbx.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'scontent.fmnl3-4.fna.fbcdn.net',
          pathname: '/**',
        },
      ],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                  {
                    key: "Permission-Policy",
                    value: "geolocation(), microphone(), camera(), payment()"
                  },
                  {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                  },
                  {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                  },
                  {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin',
                  },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                  {
                    key: 'Content-Type',
                    value: 'application/javascript; charset=utf-8',
                  },
                  {
                    key: 'Cache-Control',
                    value: 'no-cache, no-store, must-revalidate',
                  },
                  {
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self'",
                  },
                ],
            },
        ]
    }
};

export default config;
