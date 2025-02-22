"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <ProtectedRoute allowedTypes={['admin']}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedTypes={['admin']}>
      <DashboardLayout>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Imóveis Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data?.imoveis.total}</p>
              <p className="text-sm text-muted-foreground">
                {data?.imoveis.ativos} imóveis disponíveis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(data?.pagamentos.pendentes.valor || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.pagamentos.pendentes.quantidade} pagamentos pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Atrasados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(data?.pagamentos.atrasados.valor || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.pagamentos.atrasados.quantidade} pagamentos atrasados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data?.pagamentos.recebidos.valor || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {data?.pagamentos.recebidos.quantidade} pagamentos recebidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total a Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  (data?.pagamentos.pendentes.valor || 0) +
                    (data?.pagamentos.atrasados.valor || 0)
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {(data?.pagamentos.pendentes.quantidade || 0) +
                  (data?.pagamentos.atrasados.quantidade || 0)}{" "}
                pagamentos pendentes/atrasados
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.atividadesRecentes.map((atividade, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{atividade.tipo}</p>
                    <p className="text-sm text-muted-foreground">
                      {atividade.imovel.nome} - {atividade.descricao}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {atividade.data}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
