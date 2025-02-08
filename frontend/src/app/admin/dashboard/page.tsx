"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedTypes={['admin']}>
      <DashboardLayout>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Imóveis Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-muted-foreground">Total de imóveis no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contratos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">28</p>
              <p className="text-sm text-muted-foreground">Aluguéis em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 15.750,00</p>
              <p className="text-sm text-muted-foreground">Aluguéis a receber</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Novo Contrato</p>
                  <p className="text-sm text-muted-foreground">Apartamento 302 - Residencial Aurora</p>
                </div>
                <span className="text-sm text-muted-foreground">Há 2 horas</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Pagamento Recebido</p>
                  <p className="text-sm text-muted-foreground">Casa 123 - Jardim das Flores</p>
                </div>
                <span className="text-sm text-muted-foreground">Ontem</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
