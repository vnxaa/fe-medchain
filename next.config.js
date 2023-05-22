/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NFT_STORAGE_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVmOTJmNkFjNjlCOEMxODVBNjgxNThlMjI5ZmI3QjI1MzQyZjY3ZTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTQ0NTY0OTU0NSwibmFtZSI6Im1lZGNoYWluIn0.ZOeZQKigsaO1xIAeuD5pTyVnCXYh5Xu1MZVSUoedBok`,
    NFT_ADDRESS: `0x5D0DE0C808F3bB53B46fA44F75503Aa4A4d65CB3`,
    secretKey: `mySecreckey`,
  },
};

module.exports = nextConfig;
