package com.alugafacil.controller;

import com.alugafacil.model.Pagamento;
import com.alugafacil.service.PagamentoService;
import com.alugafacil.service.HistoricoPagamentoService;
import com.alugafacil.service.PagamentoScheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/pagamentos")
@CrossOrigin(origins = "*")
public class PagamentoController {

    private static final Logger logger = LoggerFactory.getLogger(PagamentoController.class);

    private final PagamentoService pagamentoService;
    private final HistoricoPagamentoService historicoPagamentoService;
    private final PagamentoScheduler pagamentoScheduler;

    public PagamentoController(PagamentoService pagamentoService, HistoricoPagamentoService historicoPagamentoService, PagamentoScheduler pagamentoScheduler) {
        this.pagamentoService = pagamentoService;
        this.historicoPagamentoService = historicoPagamentoService;
        this.pagamentoScheduler = pagamentoScheduler;
    }

    @GetMapping
    public ResponseEntity<List<Pagamento>> listarTodos() {
        return ResponseEntity.ok(pagamentoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pagamento> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pagamentoService.buscarPorId(id));
    }

    @GetMapping("/contrato/{contratoId}")
    public ResponseEntity<List<Pagamento>> buscarPorContrato(@PathVariable Long contratoId) {
        List<Pagamento> pagamentos = pagamentoService.listarPorAluguel(contratoId);
        return ResponseEntity.ok(pagamentos);
    }

    @PostMapping
    public ResponseEntity<Pagamento> criar(@RequestBody Pagamento pagamento) {
        return ResponseEntity.ok(pagamentoService.criar(pagamento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pagamento> atualizar(@PathVariable Long id, @RequestBody Pagamento pagamento) {
        return ResponseEntity.ok(pagamentoService.atualizar(id, pagamento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pagamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Pagamento> atualizarPagamento(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        try {
            logger.info("Atualizando pagamento {}: {}", id, updates);

            Pagamento pagamento = pagamentoService.buscarPorId(id);
            logger.info("Pagamento encontrado: {}", pagamento);

            // Se houver forma de pagamento e status, atualiza ambos em uma única transação
            if (updates.containsKey("formaPagamento") && updates.containsKey("status")) {
                String formaPagamento = updates.get("formaPagamento");
                String status = updates.get("status");
                logger.info("Atualizando forma de pagamento para: {} e status para: {}", formaPagamento, status);
                pagamento = pagamentoService.confirmarPagamento(id, formaPagamento, status);
            } 
            // Se houver apenas forma de pagamento
            else if (updates.containsKey("formaPagamento")) {
                String formaPagamento = updates.get("formaPagamento");
                logger.info("Atualizando forma de pagamento para: {}", formaPagamento);
                pagamento = pagamentoService.alterarFormaPagamento(id, formaPagamento);
            }
            // Se houver apenas status
            else if (updates.containsKey("status")) {
                String status = updates.get("status");
                logger.info("Atualizando status para: {}", status);
                pagamento = pagamentoService.alterarStatus(id, status);
            }

            logger.info("Pagamento atualizado com sucesso: {}", pagamento);
            return ResponseEntity.ok(pagamento);
        } catch (Exception e) {
            logger.error("Erro ao atualizar pagamento: ", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar pagamento: " + e.getMessage(), e);
        }
    }

    @PatchMapping("/{id}/forma-pagamento")
    public ResponseEntity<Pagamento> alterarFormaPagamento(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        String formaPagamento = updates.get("formaPagamento");
        try {
            Pagamento pagamentoAtualizado = pagamentoService.alterarFormaPagamento(id, formaPagamento);
            return ResponseEntity.ok(pagamentoAtualizado);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar forma de pagamento", e);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Pagamento> alterarStatus(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        String status = updates.get("status");
        try {
            Pagamento pagamentoAtualizado = pagamentoService.alterarStatus(id, status);
            return ResponseEntity.ok(pagamentoAtualizado);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar status", e);
        }
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<?> processarPagamento(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            logger.info("Processando pagamento: {}", body);
            String metodo = body.get("metodo");

            if (metodo == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Método de pagamento não especificado"));
            }

            // Busca o pagamento primeiro
            Pagamento pagamento = pagamentoService.buscarPorId(id);

            // Verifica se já está pago
            if ("PAGO".equals(pagamento.getStatus())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Este pagamento já foi processado"));
            }

            // Atualiza a forma de pagamento primeiro
            pagamentoService.alterarFormaPagamento(id, metodo);

            // Depois marca como pago, o que também criará o histórico
            Pagamento pagamentoAtualizado = pagamentoService.alterarStatus(id, "PAGO");

            return ResponseEntity.ok(pagamentoAtualizado);
        } catch (Exception e) {
            logger.error("Erro ao processar pagamento: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erro ao processar pagamento: " + e.getMessage()));
        }
    }

    @GetMapping("/agrupados")
    public ResponseEntity<List<Map<String, Object>>> listarAgrupados() {
        try {
            List<Pagamento> pagamentos = pagamentoService.listarTodos();
            List<Map<String, Object>> resultado = new ArrayList<>();

            Map<Long, Map<String, Object>> agrupados = new HashMap<>();

            for (Pagamento pagamento : pagamentos) {
                if (pagamento == null || pagamento.getAluguel() == null) {
                    continue;
                }

                Long aluguelId = pagamento.getAluguel().getId();
                if (aluguelId == null) {
                    continue;
                }

                Map<String, Object> grupo = agrupados.computeIfAbsent(aluguelId, k -> {
                    Map<String, Object> novoGrupo = new HashMap<>();
                    novoGrupo.put("contratoId", k);
                    novoGrupo.put("valorTotal", 0.0);
                    novoGrupo.put("totalPagamentos", 0);
                    novoGrupo.put("pagos", 0);
                    novoGrupo.put("valorPago", 0.0);
                    novoGrupo.put("pendentes", 0);
                    novoGrupo.put("valorPendente", 0.0);
                    novoGrupo.put("atrasados", 0);
                    novoGrupo.put("valorAtrasado", 0.0);

                    // Adiciona dados do imóvel
                    Map<String, String> imovel = new HashMap<>();
                    imovel.put("codigo", pagamento.getAluguel().getImovel().getCodigo());
                    imovel.put("nome", pagamento.getAluguel().getImovel().getNome());
                    novoGrupo.put("imovel", imovel);
                    // Adiciona dados do cliente
                    Map<String, String> cliente = new HashMap<>();
                    cliente.put("nome", pagamento.getAluguel().getCliente().getNome());

                    novoGrupo.put("cliente", cliente);

                    return novoGrupo;
                });

                grupo.put("valorTotal", (Double) grupo.get("valorTotal") + pagamento.getValor());
                grupo.put("totalPagamentos", (Integer) grupo.get("totalPagamentos") + 1);

                if ("PAGO".equals(pagamento.getStatus())) {
                    grupo.put("pagos", (Integer) grupo.get("pagos") + 1);
                    grupo.put("valorPago", (Double) grupo.get("valorPago") + pagamento.getValor());
                } else if ("PENDENTE".equals(pagamento.getStatus())) {
                    grupo.put("pendentes", (Integer) grupo.get("pendentes") + 1);
                    grupo.put("valorPendente", (Double) grupo.get("valorPendente") + pagamento.getValor());
                } else if ("ATRASADO".equals(pagamento.getStatus())) {
                    grupo.put("atrasados", (Integer) grupo.get("atrasados") + 1);
                    grupo.put("valorAtrasado", (Double) grupo.get("valorAtrasado") + pagamento.getValor());
                }
            }

            resultado.addAll(agrupados.values());
            return ResponseEntity.ok(resultado);

        } catch (Exception e) {
            logger.error("Erro ao agrupar pagamentos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/atualizar-status")
    public ResponseEntity<String> atualizarStatusPagamentos() {
        try {
            pagamentoScheduler.atualizarStatusPagamentosManualmente();
            return ResponseEntity.ok("Status dos pagamentos atualizados com sucesso");
        } catch (Exception e) {
            logger.error("Erro ao atualizar status dos pagamentos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
