"use client";

import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClienteHome() {
  return (
    <ProtectedRoute allowedTypes={['cliente']}>
      <DashboardLayout>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Aluguéis Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Imóveis alugados atualmente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximo Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 2.500,00</p>
              <p className="text-sm text-muted-foreground">Vencimento em 10/02/2025</p>
              <Button className="mt-4">Pagar Agora</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Meus Imóveis Alugados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Apartamento 302 - Residencial Aurora</h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Contrato: 12 meses</span>
                  <span>Início: 01/01/2025</span>
                  <span>Valor: R$ 1.500,00</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">Ver Contrato</Button>
                  <Button variant="outline" size="sm">Reportar Problema</Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Casa 123 - Jardim das Flores</h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Contrato: 24 meses</span>
                  <span>Início: 15/12/2024</span>
                  <span>Valor: R$ 1.000,00</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">Ver Contrato</Button>
                  <Button variant="outline" size="sm">Reportar Problema</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
