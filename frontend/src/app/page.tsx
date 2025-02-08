"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PropertyCard } from "@/components/property-card"
import { useEffect, useState } from "react"
import { Imovel } from "@/types"
import { imoveis } from "@/lib/api"

export default function Home() {
  const [imoveisList, setImoveisList] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredImoveis, setFilteredImoveis] = useState<Imovel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoImovel, setTipoImovel] = useState('')
  const [precoMin, setPrecoMin] = useState('')
  const [precoMax, setPrecoMax] = useState('')
  const [ordenacao, setOrdenacao] = useState('recent')

  useEffect(() => {
    const fetchImoveis = async () => {
      try {
        const data = await imoveis.listar()
        setImoveisList(data)
        setFilteredImoveis(data)
        setLoading(false)
      } catch (err) {
        setError('Erro ao carregar imóveis')
        setLoading(false)
      }
    }

    fetchImoveis()
  }, [])

  useEffect(() => {
    let filtered = [...imoveisList]

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(imovel =>
        imovel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por tipo
    if (tipoImovel) {
      filtered = filtered.filter(imovel => imovel.tipo === tipoImovel)
    }

    // Filtro por preço
    if (precoMin) {
      filtered = filtered.filter(imovel => imovel.valorMensal >= Number(precoMin))
    }
    if (precoMax) {
      filtered = filtered.filter(imovel => imovel.valorMensal <= Number(precoMax))
    }

    // Ordenação
    switch (ordenacao) {
      case 'price_asc':
        filtered.sort((a, b) => a.valorMensal - b.valorMensal)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.valorMensal - a.valorMensal)
        break
      case 'recent':
      default:
        // Assumindo que os IDs mais recentes são maiores
        filtered.sort((a, b) => b.id - a.id)
    }

    setFilteredImoveis(filtered)
  }, [imoveisList, searchTerm, tipoImovel, precoMin, precoMax, ordenacao])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando imóveis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">AlugaFácil</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild>
              <a href="/register">Cadastrar</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/anunciar">Anunciar Imóvel</a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Encontre o imóvel perfeito para alugar
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Alugue com facilidade e segurança
            </p>
          </div>

          {/* Advanced Search Section */}
          <div className="mt-10 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Busque por cidade ou bairro"
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="lg" className="px-8">
                  Buscar
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <select 
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                >
                  <option value="">Tipo de Imóvel</option>
                  <option value="APARTAMENTO">Apartamento</option>
                  <option value="CASA">Casa</option>
                  <option value="STUDIO">Studio</option>
                  <option value="COMERCIAL">Comercial</option>
                </select>
                <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
                  <option value="">Quartos</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
                <Input
                  type="number"
                  placeholder="Preço mínimo"
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Preço máximo"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Imóveis em Destaque</h3>
          <div className="flex items-center gap-4">
            <select 
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
            >
              <option value="recent">Mais recentes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImoveis.map((imovel) => (
            <PropertyCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      </main>
    </div>
  )
}
