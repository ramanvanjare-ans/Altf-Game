


export const API_CONFIG = {
  baseUrl: 'https://api.infermedica.com/v3',
  // Replace these with your actual Infermedica API credentials
  appId: 'YOUR_APP_ID',
  appKey: 'YOUR_APP_KEY',
};


export const isApiConfigured = () => {
  return API_CONFIG.appId !== 'YOUR_APP_ID' && API_CONFIG.appKey !== 'YOUR_APP_KEY';
};

 export const apiHeaders = {
  'App-Id': API_CONFIG.appId,
  'App-Key': API_CONFIG.appKey,
  'Content-Type': 'application/json',
};