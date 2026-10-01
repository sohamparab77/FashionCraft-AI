// config.js
export const serverUrl = 'http://localhost:8080'; 
const config = {
  development: {
    backendUrl: `${serverUrl}/api/v1/sd`, 
  },
  production: {
    backendUrl: `${serverUrl}/api/v1/sd`,
  },
};

export default config;
