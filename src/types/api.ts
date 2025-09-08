export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string>;
  };
}

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}
