package com.alugafacil.security; // Define o pacote da classe

import com.alugafacil.service.UsuarioService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de autenticação JWT que é executado uma vez por requisição.
 */
@Component // Define esta classe como um componente gerenciado pelo Spring
@RequiredArgsConstructor // Cria automaticamente um construtor com os campos finais (final)
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider; // Provedor de tokens JWT (responsável por criar e validar tokens)
    private final UsuarioService usuarioService; // Serviço de usuários para carregar detalhes do usuário

    /**
     * Método chamado para cada requisição HTTP. Verifica se há um token JWT válido e autentica o usuário.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Obtém o token JWT do cabeçalho da requisição
            String jwt = getJwtFromRequest(request);

            // Se o token for válido, extrai o ID do usuário e autentica no contexto de segurança
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromJWT(jwt); // Obtém o ID do usuário a partir do token
                UserDetails userDetails = usuarioService.loadUserById(userId); // Carrega os detalhes do usuário
                
                // Cria um objeto de autenticação com os detalhes do usuário
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Adiciona detalhes adicionais à autenticação
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Define a autenticação no contexto de segurança do Spring Security
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Não foi possível definir a autenticação do usuário no contexto de segurança", ex);
        }

        // Continua a execução da requisição
        filterChain.doFilter(request, response);
    }

    /**
     * Extrai o token JWT do cabeçalho "Authorization" da requisição.
     * @param request Objeto da requisição HTTP
     * @return Token JWT ou null se não existir um token válido
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization"); // Obtém o valor do cabeçalho "Authorization"
        
        // Verifica se o token está presente e começa com "Bearer "
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " e retorna apenas o token JWT
        }
        return null; // Retorna null se o token não for encontrado
    }
}
