import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Imovel } from "@/types"
import { MapPin, Home } from "@/components/icons"

interface PropertyCardProps {
  id: number
  nome: string
  endereco: string
  tipo: string
  valorMensal: number
  status: string
  onClick: () => void
}

export function PropertyCard({
  id,
  nome,
  endereco,
  tipo,
  valorMensal,
  status,
  onClick,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg">{nome}</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{endereco}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            <span>{tipo}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Valor Mensal</p>
            <p className="font-medium">{valorMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
