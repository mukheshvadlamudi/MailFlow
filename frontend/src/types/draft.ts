export interface Draft {
  id: number;
  email_id?: number;
  subject: string;
  body: string;
  recipient: string;
  meta_data?: any;
  created_at: string;
  updated_at: string;
}
