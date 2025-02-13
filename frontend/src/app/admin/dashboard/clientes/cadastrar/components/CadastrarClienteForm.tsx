"use client";

import { useState } from "react";
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
  cpf: z.string().min(11, "CPF deve conter 11 dígitos").max(11, "CPF deve conter 11 dígitos"),
  telefone: z.string().min(10, "Telefone deve conter no mínimo 10 dígitos").max(11, "Telefone deve conter no máximo 11 dígitos"),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  dataNascimento: z.string(),
  status: z.enum(["ATIVO", "INATIVO", "BLOQUEADO"]).default("ATIVO"),
});

type FormData = z.infer<typeof formSchema>;

export default function CadastrarClienteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

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

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      // Converte a data de DD/MM/YYYY para YYYY-MM-DD
      const [day, month, year] = data.dataNascimento.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      // Remove caracteres não numéricos do CPF
      const cpfLimpo = data.cpf.replace(/\\D/g, "");

      const clienteData: ClienteDTO = {
        ...data,
        cpf: cpfLimpo,
        senha: cpfLimpo, // Usando CPF como senha
        telefone: data.telefone.replace(/\\D/g, ""),
        dataNascimento: formattedDate
      };

      await ClientesService.cadastrar(clienteData);
      toast.success("Cliente cadastrado com sucesso!");
      router.push("/admin/dashboard/clientes");
    } catch (error: any) {
      console.error('Erro completo:', error);
      console.error('Resposta da API:', error.response?.data);
      toast.error(error.response?.data?.message || "Erro ao cadastrar cliente");
    } finally {
      setLoading(false);
    }
  }

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
                <FormLabel>CPF (será usado como senha)</FormLabel>
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
                  <Input 
                    placeholder="DD/MM/AAAA"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      
                      // Limita a 8 dígitos (DDMMAAAA)
                      if (value.length > 8) {
                        value = value.slice(0, 8);
                      }
                      
                      // Formata a data (DD/MM/AAAA)
                      let formattedDate = value;
                      
                      // Adiciona as barras conforme digita
                      if (value.length >= 2) {
                        formattedDate = value.slice(0, 2);
                        if (value.length > 2) {
                          formattedDate += "/" + value.slice(2, 4);
                          if (value.length > 4) {
                            formattedDate += "/" + value.slice(4, 8);
                          }
                        }
                      }
                      
                      field.onChange(formattedDate);
                    }}
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
          {loading ? "Cadastrando..." : "Cadastrar Cliente"}
        </Button>
      </form>
    </Form>
  );
}
