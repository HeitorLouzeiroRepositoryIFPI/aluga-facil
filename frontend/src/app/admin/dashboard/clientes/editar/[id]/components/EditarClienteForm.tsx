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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientesService, ClienteDTO } from "@/services/clientes";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().regex(/^\\d{11}$/, "CPF deve conter 11 dígitos"),
  telefone: z.string().regex(/^\\d{10,11}$/, "Telefone deve conter 10 ou 11 dígitos"),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  dataNascimento: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  status: z.enum(["ATIVO", "INATIVO", "BLOQUEADO"]),
});

type FormData = z.infer<typeof formSchema>;

interface EditarClienteFormProps {
  id: number;
}

export default function EditarClienteForm({ id }: EditarClienteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      endereco: "",
      dataNascimento: "",
      status: "ATIVO",
    },
  });

  useEffect(() => {
    if (!user || userType !== 'admin') {
      router.push('/login');
      return;
    }

    async function carregarCliente() {
      try {
        const data = await ClientesService.buscarPorId(id);
        setCliente(data);
        form.reset({
          nome: data.nome,
          email: data.email,
          cpf: data.cpf,
          telefone: data.telefone,
          endereco: data.endereco,
          dataNascimento: data.dataNascimento,
          status: data.status,
        });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar cliente");
        router.push("/admin/dashboard/clientes");
      }
    }

    carregarCliente();
  }, [id, form, router, user, userType]);

  async function onSubmit(data: FormData) {
    if (!cliente) return;

    setLoading(true);
    try {
      const clienteData: ClienteDTO = {
        ...cliente,
        ...data,
        cpf: data.cpf.replace(/\\D/g, ""),
        telefone: data.telefone.replace(/\\D/g, ""),
      };

      await ClientesService.atualizar(id, clienteData);
      toast.success("Cliente atualizado com sucesso!");
      router.push("/admin/dashboard/clientes");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar cliente");
    } finally {
      setLoading(false);
    }
  }

  if (!user || userType !== 'admin') return null;

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
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Digite o email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o CPF"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\\D/g, "");
                      if (value.length <= 11) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o telefone"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\\D/g, "");
                      if (value.length <= 11) {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="BLOQUEADO">Bloqueado</SelectItem>
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar Cliente"}
        </Button>
      </form>
    </Form>
  );
}
