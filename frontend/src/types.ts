export interface Campaign {
  id: string;
  name: string;
  totalMessages: number;
  sentMessages: number;
  status: 'pending' | 'sending' | 'completed' | 'failed';
  scheduledDate: string;
  createdAt: string;
}