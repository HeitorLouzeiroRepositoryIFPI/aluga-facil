"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImoveisService, ImovelDTO } from "@/services/imoveis";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valorMensal: z.coerce.number().min(0, "Valor mensal deve ser maior que zero"),
  status: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditarImovelForm({ codigo }: { codigo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      endereco: "",
      tipo: "",
      descricao: "",
      valorMensal: 0,
      status: "DISPONIVEL",
    },
  });

  useEffect(() => {
    const fetchImovel = async () => {
      try {
        const data = await ImoveisService.buscarPorCodigo(codigo);
        form.reset({
          nome: data.nome,
          endereco: data.endereco,
          tipo: data.tipo,
          descricao: data.descricao,
          valorMensal: data.valorMensal,
          status: data.status,
        });
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
        toast.error("Erro ao carregar dados do imóvel");
      }
    };

    if (codigo) {
      fetchImovel();
    }
  }, [codigo, form]);

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await ImoveisService.atualizar(codigo, values);
      toast.success("Imóvel atualizado com sucesso!");
      router.push("/admin/dashboard/imoveis");
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
      toast.error("Erro ao atualizar imóvel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do imóvel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Imóvel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CASA">Casa</SelectItem>
                    <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                    <SelectItem value="COMERCIAL">Comércial</SelectItem>
                    <SelectItem value="TERRENO">Terreno</SelectItem>
                    <SelectItem value="SALA_COMERCIAL">Sala Comercial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorMensal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Mensal (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Digite o valor mensal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status do imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                    <SelectItem value="ALUGADO">Alugado</SelectItem>
                    <SelectItem value="MANUTENCAO">Em Manutenção</SelectItem>
                    <SelectItem value="RESERVADO">Reservado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Digite o endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o imóvel"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar Imóvel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
