import { randomUUID } from 'node:crypto';
import type { AppConfig } from '../config.js';
import { HttpError } from '../lib/http-error.js';

interface YooKassaPayment {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
  metadata?: { payment_token?: string };
}

interface YooKassaPayout {
  id: string;
  status: string;
}

export class YooKassaService {
  constructor(private readonly config: AppConfig) {}

  private async request<T>(pathname: string, init?: RequestInit): Promise<T> {
    if (!this.config.yookassaShopId || !this.config.yookassaSecretKey) {
      throw new HttpError(503, 'Интеграция с ЮKassa не настроена');
    }

    const response = await fetch(`https://api.yookassa.ru/v3${pathname}`, {
      ...init,
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.config.yookassaShopId}:${this.config.yookassaSecretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new HttpError(502, 'ЮKassa отклонила запрос', { detail: 'ЮKassa отклонила запрос', provider_response: detail });
    }

    return response.json() as Promise<T>;
  }

  createPayment(amount: number, paymentToken: string, description: string): Promise<YooKassaPayment> {
    return this.request('/payments', {
      method: 'POST',
      headers: { 'Idempotence-Key': randomUUID() },
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: 'RUB' },
        confirmation: {
          type: 'redirect',
          return_url: `${this.config.domain}/api/payment/status/${paymentToken}/`,
        },
        capture: true,
        description,
        metadata: { payment_token: paymentToken, user_id: paymentToken },
      }),
    });
  }

  createPayout(amount: number, fee: number, cardNumber: string): Promise<YooKassaPayout> {
    return this.request('/payouts', {
      method: 'POST',
      headers: { 'Idempotence-Key': randomUUID() },
      body: JSON.stringify({
        amount: { value: (amount - fee).toFixed(2), currency: 'RUB' },
        payout_destination_data: { type: 'bank_card', card: { number: cardNumber } },
        description: 'Вывод средств на карту',
        metadata: { fee },
      }),
    });
  }

  getPayment(id: string): Promise<YooKassaPayment> {
    return this.request(`/payments/${encodeURIComponent(id)}`);
  }

  getPayout(id: string): Promise<YooKassaPayout> {
    return this.request(`/payouts/${encodeURIComponent(id)}`);
  }
}
