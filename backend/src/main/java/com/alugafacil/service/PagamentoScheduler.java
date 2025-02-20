package com.alugafacil.service;

import com.alugafacil.model.Pagamento;
import com.alugafacil.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
public class PagamentoScheduler {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "America/Sao_Paulo") // Executa todos os dias às 00:03 (horário de Brasília)
    @Transactional
    public void atualizarStatusPagamentos() {
        LocalDateTime agora = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        log.info("Iniciando atualização automática de status dos pagamentos em: {}", agora.format(formatter));
        
        LocalDate hoje = LocalDate.now(ZoneId.of("America/Sao_Paulo"));
        
        // Busca pagamentos pendentes com data vencida (incluindo a data atual)
        List<Pagamento> pagamentosVencidos = pagamentoRepository.findByStatusAndDataPagamentoLessThanEqual("PENDENTE", hoje);
        log.info("Encontrados {} pagamentos vencidos para atualizar", pagamentosVencidos.size());
        
        // Atualiza status para ATRASADO
        for (Pagamento pagamento : pagamentosVencidos) {
            pagamento.setStatus("ATRASADO");
            pagamentoRepository.save(pagamento);
            log.info("Pagamento {} atualizado para ATRASADO", pagamento.getId());
        }
        
        log.info("Atualização automática de status concluída em: {}", 
            LocalDateTime.now(ZoneId.of("America/Sao_Paulo")).format(formatter));
    }

    // Método para forçar a atualização dos status (útil para testes ou atualizações manuais)
    @Transactional
    public void atualizarStatusPagamentosManualmente() {
        log.info("Iniciando atualização manual de status dos pagamentos");
        atualizarStatusPagamentos();
        log.info("Atualização manual de status concluída");
    }
}
