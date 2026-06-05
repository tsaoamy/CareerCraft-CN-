/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  serverExternalPackages: ['sql.js', 'bcryptjs', '@cloudbase/node-sdk', 'pdf-parse', 'mammoth', 'word-extractor'],
  // 环境变量仅透传，不再硬编码默认值
  // 本地开发 → .env.local   |   腾讯云生产 → 云托管控制台环境变量
  env: {
    NEXT_PUBLIC_CLOUDBASE_ENV_ID:
      process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID,
    NEXT_PUBLIC_CLOUDBASE_REGION:
      process.env.NEXT_PUBLIC_CLOUDBASE_REGION,
    NEXT_PUBLIC_CLOUDBASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLOUDBASE_PUBLISHABLE_KEY,
  },
};

module.exports = nextConfig;
