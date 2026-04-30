const appConfig = {
  baseURL: 'http://localhost:5001',
  env: process.env.NODE_ENV || 'development',

  // Always get latest token
  get token() {
    return localStorage.getItem('token');
  },
};

export default appConfig;