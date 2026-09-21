const appConfig = {
  baseURL: 'http://localhost:5001',
  env: import.meta.env.MODE || 'development',

  // Always get latest token
  get token() {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      return userDetails?.token || localStorage.getItem('token');
    } catch {
      return localStorage.getItem('token');
    }
  },
};

export default appConfig;