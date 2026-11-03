import { http } from '@/shared/api/http';
import type { Transaction, Withdrawal } from '../model/types';

export const financeApi = {
  getTransactions: () => http.get<Transaction[]>('transactions/'),
  getWithdrawals: () => http.get<Withdrawal[]>('withdrawals/history/'),
  createMockWithdrawal: (amount: number) =>
    http.post<Pick<Withdrawal, 'id' | 'amount' | 'fee' | 'status'>>('mock-withdraw/', { amount }),
};
