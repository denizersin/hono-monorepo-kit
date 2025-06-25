/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
};
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)