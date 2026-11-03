import type { TransactionType, WithdrawalStatus } from './types';

export const transactionLabel: Record<TransactionType, string> = {
  deposit: 'Пополнение', withdrawal: 'Вывод средств', payment: 'Оплата',
};

export const withdrawalStatusLabel: Record<WithdrawalStatus, string> = {
  pending: 'Ожидает', processing: 'В обработке', succeeded: 'Выполнен', canceled: 'Отменён', failed: 'Ошибка',
};

export const withdrawalStatusTone: Record<WithdrawalStatus, 'warning' | 'info' | 'success' | 'neutral' | 'danger'> = {
  pending: 'warning', processing: 'info', succeeded: 'success', canceled: 'neutral', failed: 'danger',
};
