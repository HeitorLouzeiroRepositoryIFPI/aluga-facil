"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { RoleContent } from "@/components/role-content"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export default function Page() {
  const { userType } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {userType === 'admin' ? 'Dashboard Administrativo' : 'Área do Cliente'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Conteúdo específico para Administrador */}
          <RoleContent roles={['admin']}>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Imóveis Cadastrados</CardTitle>
                  <CardDescription>Total de imóveis no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">42</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contratos Ativos</CardTitle>
                  <CardDescription>Aluguéis em andamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">28</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos Pendentes</CardTitle>
                  <CardDescription>Aluguéis a receber</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">R$ 15.750,00</p>
                </CardContent>
              </Card>
            </div>
          </RoleContent>

          {/* Conteúdo específico para Cliente */}
          <RoleContent roles={['cliente']}>
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Aluguéis</CardTitle>
                  <CardDescription>Imóveis alugados atualmente</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">2</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Próximo Pagamento</CardTitle>
                  <CardDescription>Vencimento em 15/02/2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">R$ 1.200,00</p>
                </CardContent>
              </Card>
            </div>
          </RoleContent>

          {/* Lista de atividades recentes - visível para ambos */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas atualizações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Pagamento Registrado</p>
                    <p className="text-sm text-muted-foreground">Aluguel ref. Janeiro/2025</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Há 2 horas</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Novo Contrato</p>
                    <p className="text-sm text-muted-foreground">Apartamento 302 - Residencial Aurora</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Ontem</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
