package com.alugafacil.service;

import com.alugafacil.exception.BusinessException;
import com.alugafacil.exception.ResourceNotFoundException;
import com.alugafacil.model.Aluguel;
import com.alugafacil.model.Cliente;
import com.alugafacil.model.Imovel;
import com.alugafacil.model.Pagamento;
import com.alugafacil.repository.AluguelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AluguelService {
    
    private final AluguelRepository aluguelRepository;
    private final ClienteService clienteService;
    private final ImovelService imovelService;
    private final PagamentoService pagamentoService;
    
    @Transactional
    public Aluguel criar(Aluguel aluguel, Long clienteId, Long imovelId) {
        // Validar cliente
        Cliente cliente = clienteService.buscarPorId(clienteId);
        aluguel.setCliente(cliente);
        
        // Validar imóvel
        Imovel imovel = imovelService.buscarPorId(imovelId);
        aluguel.setImovel(imovel);
        
        // Verificar disponibilidade
        if (!verificarDisponibilidade(imovelId, aluguel.getDataInicio(), aluguel.getDataFim())) {
            throw new BusinessException("Imóvel não está disponível no período selecionado");
        }
        
        // Definir status inicial
        aluguel.setStatus("ATIVO");
        
        // Salvar aluguel
        Aluguel aluguelSalvo = aluguelRepository.save(aluguel);
        
        // Gerar pagamentos mensais
        List<Pagamento> pagamentos = gerarPagamentosMensais(aluguelSalvo);
        pagamentoService.criarTodos(pagamentos);
        
        return aluguelSalvo;
    }
    
    private List<Pagamento> gerarPagamentosMensais(Aluguel aluguel) {
        List<Pagamento> pagamentos = new ArrayList<>();
        
        // Calcular número de meses entre data início e fim
        long meses = ChronoUnit.MONTHS.between(
            aluguel.getDataInicio().withDayOfMonth(1),
            aluguel.getDataFim().withDayOfMonth(1)
        ) + 1;
        
        // Gerar um pagamento para cada mês
        for (int i = 0; i < meses; i++) {
            LocalDate dataPagamento = aluguel.getDataInicio()
                .plusMonths(i)
                .withDayOfMonth(aluguel.getDiaPagamento());
            
            Pagamento pagamento = Pagamento.builder()
                .aluguel(aluguel)
                .valor(aluguel.getValorMensal())
                .dataPagamento(dataPagamento)
                .status("PENDENTE")
                .build();
            
            pagamentos.add(pagamento);
        }
        
        return pagamentos;
    }
    
    public Aluguel buscarPorId(Long id) {
        return aluguelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluguel não encontrado"));
    }
    
    public List<Aluguel> listarTodos() {
        return aluguelRepository.findAll();
    }
    
    public List<Aluguel> listarPorCliente(Long clienteId) {
        Cliente cliente = clienteService.buscarPorId(clienteId);
        return aluguelRepository.findByCliente(cliente);
    }
    
    public List<Aluguel> listarPorImovel(Long imovelId) {
        Imovel imovel = imovelService.buscarPorId(imovelId);
        return aluguelRepository.findByImovel(imovel);
    }
    
    public List<Aluguel> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        return aluguelRepository.findByDataInicioBetweenOrDataFimBetween(inicio, fim, inicio, fim);
    }
    
    @Transactional
    public void atualizarStatus(Long id, String status) {
        Aluguel aluguel = buscarPorId(id);
        aluguel.setStatus(status);
        aluguelRepository.save(aluguel);
    }
    
    @Transactional
    public void excluir(Long id) {
        Aluguel aluguel = buscarPorId(id);
        if (!aluguel.getPagamentos().isEmpty()) {
            throw new BusinessException("Não é possível excluir um aluguel que possui pagamentos");
        }
        aluguelRepository.delete(aluguel);
    }
    
    public boolean verificarDisponibilidade(Long imovelId, LocalDate dataInicio, LocalDate dataFim) {
        Imovel imovel = imovelService.buscarPorId(imovelId);
        List<Aluguel> alugueis = aluguelRepository.findByImovelAndStatus(imovel, "ATIVO");
        
        for (Aluguel aluguel : alugueis) {
            // Verificar se há sobreposição de datas
            if (!(dataFim.isBefore(aluguel.getDataInicio()) || dataInicio.isAfter(aluguel.getDataFim()))) {
                return false;
            }
        }
        
        return true;
    }
}
