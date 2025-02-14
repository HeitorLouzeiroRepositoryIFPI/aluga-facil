'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PAYMENT_METHODS = {
  PIX: 'PIX',
  CARTAO: 'Cartão',
  BOLETO: 'Boleto',
  DINHEIRO: 'Dinheiro',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onValueChange: (value: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodSelect({ value, onValueChange, disabled }: PaymentMethodSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Forma de Pagamento" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
