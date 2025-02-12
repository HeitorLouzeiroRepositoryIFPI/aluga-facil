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
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  tipo: z.enum(["CASA", "APARTAMENTO", "COMERCIAL", "TERRENO", "SALA_COMERCIAL"]),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  valorMensal: z.string().transform((val) => parseFloat(val)),
  status: z.enum(["DISPONIVEL", "ALUGADO", "MANUTENCAO", "RESERVADO"]),
  fotos: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, "O tamanho máximo do arquivo é 5MB.")
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Apenas .jpg, .jpeg, .png e .webp são suportados."
          ),
        preview: z.string(),
      })
    )
    .optional(),
});

interface EditarImovelFormProps {
  codigo: string;
}

export default function EditarImovelForm({ codigo }: EditarImovelFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();
  const [fotos, setFotos] = useState<Array<{ file: File; preview: string }>>([]);
  const [imovel, setImovel] = useState<ImovelDTO | null>(null);
  const [fotosAtuais, setFotosAtuais] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo: "CASA",
      endereco: "",
      valorMensal: "",
      status: "DISPONIVEL",
      fotos: [],
    },
  });

  useEffect(() => {
    async function carregarImovel() {
      try {
        const data = await ImoveisService.buscarPorCodigo(codigo);
        setImovel(data);
        setFotosAtuais(data.fotos || []);
        
        form.reset({
          nome: data.nome,
          descricao: data.descricao,
          tipo: data.tipo,
          endereco: data.endereco,
          valorMensal: data.valorMensal.toString(),
          status: data.status,
        });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar imóvel");
        router.push("/admin/dashboard/imoveis");
      }
    }

    if (codigo) {
      carregarImovel();
    }
  }, [codigo, form, router]);

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFotos([...fotos, ...newFotos]);
    form.setValue("fotos", [...fotos, ...newFotos]);
  };

  const handleRemoveFoto = (index: number) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    setFotos(newFotos);
    form.setValue("fotos", newFotos);
  };

  const handleRemoveFotoAtual = async (url: string) => {
    try {
      await ImoveisService.removerFoto(codigo, url);
      setFotosAtuais(fotosAtuais.filter((foto) => foto !== url));
      toast.success("Foto removida com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover foto");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const imovelData: ImovelDTO = {
        nome: values.nome,
        endereco: values.endereco,
        descricao: values.descricao,
        valorMensal: parseFloat(values.valorMensal.toString()),
        status: values.status,
        tipo: values.tipo,
        fotos: fotosAtuais,
      };

      // Se houver novas fotos, faz o upload
      if (values.fotos && values.fotos.length > 0) {
        const fotosFiles = values.fotos.map(({ file }) => file);
        await ImoveisService.atualizarComFotos(codigo, imovelData, fotosFiles);
      } else {
        await ImoveisService.atualizar(codigo, imovelData);
      }

      toast.success("Imóvel atualizado com sucesso!");
      router.push("/admin/dashboard/imoveis");
    } catch (error) {
      toast.error("Erro ao atualizar imóvel");
      console.error(error);
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

        <FormField
          control={form.control}
          name="fotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Fotos atuais */}
                  {fotosAtuais.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Fotos atuais:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {fotosAtuais.map((foto, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={foto}
                              alt={`Foto ${index + 1}`}
                              width={200}
                              height={150}
                              className="rounded-lg object-cover w-full h-[150px]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFotoAtual(foto)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload de novas fotos */}
                  <div>
                    <p className="text-sm font-medium mb-2">Adicionar novas fotos:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {fotos.map((foto, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={foto.preview}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover w-full h-[150px]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          multiple
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="h-[150px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              />
                            </svg>
                            <div className="text-sm text-gray-600">
                              <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                <span>Adicionar fotos</span>
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">
                              JPG, PNG, WEBP até 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Adicione fotos do imóvel. Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB por foto.
              </FormDescription>
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
