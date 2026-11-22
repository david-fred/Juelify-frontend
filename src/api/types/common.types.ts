export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}
