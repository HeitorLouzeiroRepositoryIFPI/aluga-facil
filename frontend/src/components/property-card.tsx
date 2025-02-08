import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Imovel } from "@/types"

interface PropertyCardProps {
  imovel: Imovel
}

export function PropertyCard({ imovel }: PropertyCardProps) {
  const {
    nome,
    endereco,
    valorMensal,
    fotos,
    descricao,
    tipo,
    status
  } = imovel

  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        {fotos && fotos.length > 0 && (
          <img
            src={fotos[0]}
            alt={nome}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{nome}</CardTitle>
        <p className="text-sm text-gray-500">{endereco}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              {tipo}
            </span>
            <span className={`px-2 py-1 rounded-md text-sm ${status === 'DISPONIVEL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status === 'DISPONIVEL' ? 'Disponível' : 'Alugado'}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{descricao}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-gray-900">
            R$ {valorMensal.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500">por mês</p>
        </div>
        <Button asChild>
          <a href={`/imoveis/${imovel.id}`}>Ver detalhes</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
