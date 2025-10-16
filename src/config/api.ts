// API Configuration for Family Bookkeeping React App

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.mywaitime.com/family-api'
    : 'http://localhost:3017/api',
  
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register/',
      LOGIN: '/auth/login/',
      REFRESH: '/auth/refresh/',
      PROFILE: '/auth/profile/',
    },
    FAMILY: {
      LIST: '/family-members/',
      CREATE: '/family-members/',
      DETAIL: (id: number) => `/family-members/${id}/`,
    },
    EXPENSES: {
      LIST: '/expenses/',
      CREATE: '/expenses/',
      DETAIL: (id: number) => `/expenses/${id}/`,
    },
    MILES: {
      LIST: '/miles/',
      CREATE: '/miles/',
      DETAIL: (id: number) => `/miles/${id}/`,
    },
    HOURS: {
      LIST: '/hours/',
      CREATE: '/hours/',
      DETAIL: (id: number) => `/hours/${id}/`,
    },
    STATISTICS: '/statistics/',
    EXPORT: '/export/',
    IMPORT: '/import/',
    TAX_REPORT: '/tax-report/',
  }
};

export const API_TIMEOUT = 10000; // 10 seconds
export const TOKEN_REFRESH_THRESHOLD = 300; // 5 minutes
