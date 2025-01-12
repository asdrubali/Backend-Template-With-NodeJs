export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  code?: number;
  result?: T;
  errors?: string | { [key: string]: string }[];
}
