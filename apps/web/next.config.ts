/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        // Disable type checking during build
        ignoreBuildErrors: true,
    },
};
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)