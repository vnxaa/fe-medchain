/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NFT_STORAGE_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVmOTJmNkFjNjlCOEMxODVBNjgxNThlMjI5ZmI3QjI1MzQyZjY3ZTciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTQ0NTY0OTU0NSwibmFtZSI6Im1lZGNoYWluIn0.ZOeZQKigsaO1xIAeuD5pTyVnCXYh5Xu1MZVSUoedBok`,
    NFT_ADDRESS: `0x5D0DE0C808F3bB53B46fA44F75503Aa4A4d65CB3`,
    service: `https://be-medchain-service.onrender.com`,
    // service: `http://localhost:5000`,
    PRIVATE_KEY: `0821200d545c285e714aea25ceb90953d211f6b6d4a937147a8fcc4acc3e1e57`,
  },
};

module.exports = nextConfig;
