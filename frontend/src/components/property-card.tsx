import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  title: string
  location: string
  price: number
  imageUrl?: string
  description: string
  type: string
  status: 'DISPONIVEL' | 'ALUGADO'
}

export function PropertyCard({
  title,
  location,
  price,
  imageUrl,
  description,
  type,
  status
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-500">{location}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              {type}
            </span>
            <span className={`px-2 py-1 rounded-md text-sm ${status === 'DISPONIVEL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status === 'DISPONIVEL' ? 'Disponível' : 'Alugado'}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-bold text-blue-600">
          R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
        </p>
        <Button variant="outline">Ver detalhes</Button>
      </CardFooter>
    </Card>
  )
}
