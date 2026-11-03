export type TransactionType = 'deposit' | 'withdrawal' | 'payment';
export type WithdrawalStatus = 'pending' | 'processing' | 'succeeded' | 'canceled' | 'failed';

export interface Transaction {
  id: number;
  amount: number;
  transaction_type: TransactionType;
  created_at: string;
}

export interface Withdrawal {
  id: number;
  amount: number;
  bank_card_token: string;
  fee: number;
  status: WithdrawalStatus;
  yookassa_payout_id: string;
  created_at: string;
}
