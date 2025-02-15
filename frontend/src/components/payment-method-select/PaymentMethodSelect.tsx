'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui";

export const PAYMENT_METHODS = {
  PIX: 'PIX',
  CARTAO: 'Cartão',
  BOLETO: 'Boleto',
  DINHEIRO: 'Dinheiro',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

interface PaymentMethodSelectProps {
  value: PaymentMethod | null;
  onValueChange: (value: PaymentMethod | null) => void;
  onConfirmPayment?: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodSelect({ value, onValueChange, onConfirmPayment, disabled }: PaymentMethodSelectProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleChange = (newValue: string) => {
    if (newValue === 'NONE') {
      // Não permitir limpar a forma de pagamento
      return;
    } else {
      setSelectedMethod(newValue as PaymentMethod);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onValueChange(selectedMethod);
      if (onConfirmPayment) {
        onConfirmPayment(selectedMethod);
      }
    }
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setSelectedMethod(null);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Select
        value={value || 'NONE'}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Forma de Pagamento">
            {value ? PAYMENT_METHODS[value] : 'Selecione'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NONE">Selecione</SelectItem>
          {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja confirmar o pagamento usando {selectedMethod ? PAYMENT_METHODS[selectedMethod] : ''}?
              Isso irá marcar o pagamento como PAGO.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirmar Pagamento</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
