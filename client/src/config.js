let config = {};

if (process.env.NODE_ENV === 'production')
    config.SERVER_BASE_ADDRESS = "https://server-collab-editor.com";
else
    config.SERVER_BASE_ADDRESS = "http://localhost:17291";
export default config;