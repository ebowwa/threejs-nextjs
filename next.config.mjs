/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/',
          headers: [
            {
              key: 'Link',
              value: 'https://cdn.jsdelivr.net; rel=preconnect',
            },
          ],
        },
      ];
    },
    server: {
      // Increase the server timeout to 60 seconds
      timeout: 60,
    },
  };
  
  export default nextConfig;