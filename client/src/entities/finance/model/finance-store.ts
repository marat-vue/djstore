import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getApiError } from '@/shared/lib/api-error';
import { financeApi } from '../api/finance-api';
import type { Transaction, Withdrawal } from './types';

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref<Transaction[]>([]);
  const withdrawals = ref<Withdrawal[]>([]);
  const isLoadingTransactions = ref(false);
  const isLoadingWithdrawals = ref(false);
  const isWithdrawing = ref(false);
  const error = ref<string | null>(null);

  async function fetchTransactions(): Promise<void> {
    isLoadingTransactions.value = true;
    error.value = null;
    try {
      transactions.value = (await financeApi.getTransactions()).data;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось загрузить операции');
    } finally {
      isLoadingTransactions.value = false;
    }
  }

  async function fetchWithdrawals(): Promise<void> {
    isLoadingWithdrawals.value = true;
    error.value = null;
    try {
      withdrawals.value = (await financeApi.getWithdrawals()).data;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось загрузить историю выводов');
    } finally {
      isLoadingWithdrawals.value = false;
    }
  }

  async function withdraw(amount: number): Promise<boolean> {
    isWithdrawing.value = true;
    error.value = null;
    try {
      await financeApi.createMockWithdrawal(amount);
      await fetchWithdrawals();
      return true;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось вывести средства');
      return false;
    } finally {
      isWithdrawing.value = false;
    }
  }

  return {
    transactions, withdrawals, error,
    isLoadingTransactions, isLoadingWithdrawals, isWithdrawing,
    fetchTransactions, fetchWithdrawals, withdraw,
  };
});
