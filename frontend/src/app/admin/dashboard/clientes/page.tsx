"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiSearch, FiPlus, FiFilter, FiRefreshCw, FiEdit, FiTrash2 } from 'react-icons/fi';
import { ProtectedRoute } from "@/components/protected-route";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { ClientesService, ClienteDTO } from "@/services/clientes";
import { formatarCPF, formatarTelefone } from "@/lib/formatters";

export default function ClientesPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteDTO | null>(null);
  const [clientes, setClientes] = useState<ClienteDTO[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<ClienteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    bloqueados: 0
  });

  const ITEMS_PER_PAGE = 10;

  const handleDelete = (id: number) => {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
      setClienteSelecionado(cliente);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!clienteSelecionado) return;

    try {
      await ClientesService.excluir(clienteSelecionado.id!);
      toast.success('Cliente excluído com sucesso!');
      carregarClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
    } finally {
      setDeleteModalOpen(false);
      setClienteSelecionado(null);
    }
  };



  useEffect(() => {
    carregarClientes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [clientes, searchTerm, statusFilter]);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ClientesService.listar();
      
      if (Array.isArray(data) && data.length > 0) {
        setClientes(data);
        
        // Calcular estatísticas
        const total = data.length;
        const ativos = data.filter(cliente => cliente.status === 'ATIVO').length;
        const inativos = data.filter(cliente => cliente.status === 'INATIVO').length;
        const bloqueados = data.filter(cliente => cliente.status === 'BLOQUEADO').length;
        setStats({ total, ativos, inativos, bloqueados });
      } else {
        setError('Nenhum cliente encontrado');
        setClientes([]);
      }
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar os clientes');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...clientes];

    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf.includes(searchTerm)
      );
    }

    // Aplicar filtro de status
    if (statusFilter !== "TODOS") {
      filtered = filtered.filter(cliente => cliente.status === statusFilter);
    }

    setFilteredClientes(filtered);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'INATIVO':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOQUEADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <ProtectedRoute allowedTypes={['admin']}>
      <DashboardLayout>

    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Clientes</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin/dashboard/clientes/cadastrar')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Novo Cliente
          </button>
          <button
            onClick={() => carregarClientes()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total de Clientes</h3>
          <p className="text-3xl font-semibold mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Clientes Ativos</h3>
          <p className="text-3xl font-semibold mt-2 text-green-600">{stats.ativos}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Clientes Inativos</h3>
          <p className="text-3xl font-semibold mt-2 text-yellow-600">{stats.inativos}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Clientes Bloqueados</h3>
          <p className="text-3xl font-semibold mt-2 text-red-600">{stats.bloqueados}</p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
            <option value="BLOQUEADO">Bloqueado</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome/Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF/Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedClientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                paginatedClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cliente.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatarCPF(cliente.cpf)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatarTelefone(cliente.telefone)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(cliente.status)}`}>
                          {cliente.status}
                        </span>
                        <select
                          value={cliente.status}
                          onChange={(e) => handleAlterarStatus(cliente, e.target.value)}
                          className="ml-2 text-sm border border-gray-200 rounded-md p-1"
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="INATIVO">Inativo</option>
                          <option value="BLOQUEADO">Bloqueado</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => router.push(`/admin/dashboard/clientes/editar/${cliente.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {!loading && filteredClientes.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> até{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredImoveis.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredImoveis.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja excluir o cliente {clienteSelecionado?.nome}? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
    </ProtectedRoute>
  );
}
