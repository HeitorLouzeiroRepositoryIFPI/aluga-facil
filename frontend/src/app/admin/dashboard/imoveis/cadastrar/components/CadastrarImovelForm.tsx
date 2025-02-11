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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  tipo: z.enum(["CASA", "APARTAMENTO", "COMERCIAL", "TERRENO", "SALA_COMERCIAL"]),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  valorMensal: z.string().transform((val) => parseFloat(val)),
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
    .min(1, "Adicione pelo menos uma foto do imóvel"),
});

export default function CadastrarImovelForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, userType } = useAuth();

  if (!user || userType !== 'admin') {
    router.push('/login');
    return null;
  }
  const [fotos, setFotos] = useState<Array<{ file: File; preview: string }>>([]);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {


    setLoading(true);
    try {
      const imovelData: ImovelDTO = {
        nome: values.nome,
        endereco: values.endereco,
        descricao: values.descricao,
        valorMensal: parseFloat(values.valorMensal.toString()),
        tipo: values.tipo,
        fotos: [], // Será preenchido pelo serviço de upload
        administradorId: user.id,
      };

      // Extrai os arquivos das fotos
      const fotosFiles = values.fotos.map(({ file }) => file);

      // Cadastra o imóvel com as fotos
      await ImoveisService.cadastrar(imovelData, fotosFiles);
      toast.success("Imóvel cadastrado com sucesso!");
      router.push("/admin/dashboard/imoveis");
    } catch (error) {
      toast.error("Erro ao cadastrar imóvel");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormItem className="col-span-2">
                <FormLabel>Valor Mensal (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Digite o valor mensal"
                    step="0.01"
                    min="0"
                    {...field}
                  />
                </FormControl>
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
              <FormItem className="col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o imóvel detalhadamente"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="fotos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fotos do Imóvel</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {fotos.map((foto, index) => (
                          <div key={index} className="relative">
                            <img
                              src={foto.preview}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              X
                            </button>
                          </div>
                        ))}
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
          </div>
        </div>

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
            {loading ? "Cadastrando..." : "Cadastrar Imóvel"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
