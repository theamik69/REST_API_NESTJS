export class WebResponse<T> {
  status: string;
  total_users?: number;
  data?: T;
  message?: string;
  errors?: string;
}
