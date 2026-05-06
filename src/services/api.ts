// API Service for Family Bookkeeping React App

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, API_TIMEOUT, TOKEN_REFRESH_THRESHOLD } from '../config/api';
import { AuthTokens, LoginCredentials, RegisterData, User, FamilyMember, Expense, Mile, Hour, Statistics, TaxReport } from '../types';

class ApiService {
  private api: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.clearAuth();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  private clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  private async performTokenRefresh(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  // Authentication methods
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    const { user, tokens } = response.data;
    this.setTokens(tokens);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, tokens };
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    const { user, tokens } = response.data;
    this.setTokens(tokens);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, tokens };
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  private ensureAuthenticated(): void {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
  }

  // Family Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    if (!this.isAuthenticated()) return [];
    const response = await this.api.get(API_CONFIG.ENDPOINTS.FAMILY.LIST);
    return response.data;
  }

  async createFamilyMember(data: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>): Promise<FamilyMember> {
    this.ensureAuthenticated();
    const response = await this.api.post(API_CONFIG.ENDPOINTS.FAMILY.CREATE, data);
    return response.data;
  }

  async updateFamilyMember(id: number, data: Partial<FamilyMember>): Promise<FamilyMember> {
    this.ensureAuthenticated();
    const response = await this.api.put(API_CONFIG.ENDPOINTS.FAMILY.DETAIL(id), data);
    return response.data;
  }

  async deleteFamilyMember(id: number): Promise<void> {
    this.ensureAuthenticated();
    await this.api.delete(API_CONFIG.ENDPOINTS.FAMILY.DETAIL(id));
  }

  // Expenses
  async getExpenses(familyMemberId?: number): Promise<Expense[]> {
    if (!this.isAuthenticated()) return [];
    const url = familyMemberId 
      ? `${API_CONFIG.ENDPOINTS.EXPENSES.LIST}?family_member_id=${familyMemberId}`
      : API_CONFIG.ENDPOINTS.EXPENSES.LIST;
    const response = await this.api.get(url);
    return response.data;
  }

  async createExpense(data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    this.ensureAuthenticated();
    const response = await this.api.post(API_CONFIG.ENDPOINTS.EXPENSES.CREATE, data);
    return response.data;
  }

  // Miles
  async getMiles(familyMemberId?: number): Promise<Mile[]> {
    if (!this.isAuthenticated()) return [];
    const url = familyMemberId 
      ? `${API_CONFIG.ENDPOINTS.MILES.LIST}?family_member_id=${familyMemberId}`
      : API_CONFIG.ENDPOINTS.MILES.LIST;
    const response = await this.api.get(url);
    return response.data;
  }

  async createMile(data: Omit<Mile, 'id' | 'created_at' | 'updated_at'>): Promise<Mile> {
    this.ensureAuthenticated();
    const response = await this.api.post(API_CONFIG.ENDPOINTS.MILES.CREATE, data);
    return response.data;
  }

  // Hours
  async getHours(familyMemberId?: number): Promise<Hour[]> {
    if (!this.isAuthenticated()) return [];
    const url = familyMemberId 
      ? `${API_CONFIG.ENDPOINTS.HOURS.LIST}?family_member_id=${familyMemberId}`
      : API_CONFIG.ENDPOINTS.HOURS.LIST;
    const response = await this.api.get(url);
    return response.data;
  }

  async createHour(data: Omit<Hour, 'id' | 'created_at' | 'updated_at'>): Promise<Hour> {
    this.ensureAuthenticated();
    const response = await this.api.post(API_CONFIG.ENDPOINTS.HOURS.CREATE, data);
    return response.data;
  }

  // Statistics
  async getStatistics(familyMemberId?: number): Promise<Statistics> {
    if (!this.isAuthenticated()) {
      return {
        total_expenses: 0,
        total_miles: 0,
        total_hours: 0,
        total_deductions: 0,
      };
    }
    const url = familyMemberId 
      ? `${API_CONFIG.ENDPOINTS.STATISTICS}?family_member_id=${familyMemberId}`
      : API_CONFIG.ENDPOINTS.STATISTICS;
    const response = await this.api.get(url);
    return response.data;
  }

  // Export/Import
  async exportData(format: 'excel' | 'csv', year: number): Promise<Blob> {
    this.ensureAuthenticated();
    const response = await this.api.get(`${API_CONFIG.ENDPOINTS.EXPORT}?format=${format}&year=${year}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async importData(file: File, familyMemberId: number): Promise<{ message: string; errors: string[] }> {
    this.ensureAuthenticated();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('family_member_id', familyMemberId.toString());

    const response = await this.api.post(API_CONFIG.ENDPOINTS.IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Tax Report
  async getTaxReport(year: number): Promise<TaxReport> {
    this.ensureAuthenticated();
    const response = await this.api.get(`${API_CONFIG.ENDPOINTS.TAX_REPORT}?year=${year}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
