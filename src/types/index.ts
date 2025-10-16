// TypeScript types for Family Bookkeeping React App

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  email?: string;
  is_registered: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  family_member: number;
  description: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface Mile {
  id: number;
  family_member: number;
  description: string;
  miles: number;
  created_at: string;
  updated_at: string;
}

export interface Hour {
  id: number;
  family_member: number;
  description: string;
  hours: number;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface Statistics {
  total_expenses: number;
  total_miles: number;
  total_hours: number;
  total_deductions: number;
}

export interface TaxReport {
  year: number;
  total_deductible: number;
  categories: Record<string, {
    total: number;
    count: number;
    deductible: number;
    confidence: number;
  }>;
  recommendations: string[];
  forms_needed: string[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
