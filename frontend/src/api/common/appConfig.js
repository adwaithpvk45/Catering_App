const appConfig = {
  baseURL: 'http://localhost:5001',
  env: import.meta.env.MODE || 'development',

  // Always get latest token
  get token() {
    return localStorage.getItem('token');
  },
};

export default appConfig;