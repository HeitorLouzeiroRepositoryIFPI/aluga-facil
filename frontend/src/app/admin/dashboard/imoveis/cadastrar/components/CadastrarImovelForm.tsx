"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form ,
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
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  tipo: z.string().min(1, "Selecione o tipo do imóvel"),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  valorMensal: z.coerce.number().min(1, "O valor mensal deve ser maior que zero"),
});

type FormData = z.infer<typeof formSchema>;

export default function CadastrarImovelForm() {
  const router = useRouter();
  const { user, userType } = useAuth();

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      tipo: "",
      endereco: "",
      descricao: "",
      valorMensal: 0,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const imovelData: ImovelDTO = {
        nome: values.nome,
        endereco: values.endereco,
        descricao: values.descricao,
        valorMensal: values.valorMensal,
        tipo: values.tipo,
        administradorId: user.id,
      };

      await ImoveisService.cadastrar(imovelData);

      toast.success("Imóvel cadastrado com sucesso!");
      router.push("/admin/dashboard/imoveis");
    } catch (error) {
      toast.error("Erro ao cadastrar imóvel");
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Imóvel</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Casa na Praia" {...field} />
                </FormControl>
                <FormDescription>
                  Digite um nome que identifique o imóvel.
                </FormDescription>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CASA">Casa</SelectItem>
                    <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                    <SelectItem value="KITNET">Kitnet</SelectItem>
                    <SelectItem value="SALA_COMERCIAL">Sala Comercial</SelectItem>
                    <SelectItem value="LOJA">Loja</SelectItem>
                    <SelectItem value="GALPAO">Galpão</SelectItem>
                    <SelectItem value="TERRENO">Terreno</SelectItem>
                    <SelectItem value="OUTROS">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecione o tipo do imóvel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rua das Flores, 123" {...field} />
                </FormControl>
                <FormDescription>
                  Digite o endereço completo do imóvel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Casa com 3 quartos, 2 banheiros..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Descreva as características do imóvel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valorMensal"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Valor Mensal</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 1000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Digite o valor mensal do aluguel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit">Cadastrar Imóvel</Button>
        </div>
      </form>
    </FormProvider>
  );
}
