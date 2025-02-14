package com.alugafacil.controller;


import com.alugafacil.model.Pagamento;
import com.alugafacil.service.PagamentoService;
import com.alugafacil.service.PagamentoScheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/pagamentos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PagamentoController {

    private final PagamentoService pagamentoService;
    private final PagamentoScheduler pagamentoScheduler;

    @GetMapping
    public ResponseEntity<List<Pagamento>> listar() {
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

    @PatchMapping("/{id}/status")
    public ResponseEntity<Pagamento> alterarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(pagamentoService.alterarStatus(id, body.get("status")));
    }

    @PatchMapping("/{id}/forma-pagamento")
    public ResponseEntity<Pagamento> alterarFormaPagamento(@PathVariable Long id, @RequestBody Map<String, String> body) {
        log.info("Recebido request para alterar forma de pagamento: {}", body);
        String formaPagamento = body.get("formaPagamento");
        if (formaPagamento == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(pagamentoService.alterarFormaPagamento(id, formaPagamento));
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
            log.error("Erro ao agrupar pagamentos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/atualizar-status")
    public ResponseEntity<String> atualizarStatusPagamentos() {
        try {
            pagamentoScheduler.atualizarStatusPagamentosManualmente();
            return ResponseEntity.ok("Status dos pagamentos atualizados com sucesso");
        } catch (Exception e) {
            log.error("Erro ao atualizar status dos pagamentos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
