package com.alugafacil.security; // Define o pacote onde a classe está localizada

import com.alugafacil.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // Indica que essa classe contém configurações do Spring
@EnableWebSecurity // Habilita a configuração de segurança no Spring Security
@EnableMethodSecurity // Permite a utilização de segurança baseada em métodos (@PreAuthorize, @Secured, etc.)
@RequiredArgsConstructor // Gera um construtor com os campos finais (final) automaticamente pelo Lombok
public class SecurityConfig {

    private final UsuarioService usuarioService; // Serviço que gerencia os usuários
    private final JwtAuthenticationFilter jwtAuthenticationFilter; // Filtro JWT para autenticação

    /**
     * Configura um provedor de autenticação usando os dados do usuário do banco de dados.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(usuarioService); // Define o serviço que busca os usuários
        authProvider.setPasswordEncoder(passwordEncoder()); // Define o algoritmo de criptografia de senha
        return authProvider;
    }

    /**
     * Configura o gerenciador de autenticação.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Define o codificador de senha, usando BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Usa BCrypt para criptografar senhas
    }

    /**
     * Configura a cadeia de filtros de segurança para controlar o acesso à API.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Configuração de CORS (permite requisições de diferentes origens)
            .cors(cors -> cors.configure(http))

            // Desabilita a proteção contra CSRF, pois a API é stateless (não mantém sessões)
            .csrf(csrf -> csrf.disable())

            // Define a política de criação de sessões como STATELESS (sem sessão no servidor)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Define as permissões de acesso às requisições da API
            .authorizeHttpRequests(auth -> 
                auth
                    // Permite acesso irrestrito às rotas do Swagger (documentação da API)
                    .requestMatchers("/v3/api-docs/**", 
                                   "/swagger-ui/**", 
                                   "/swagger-ui.html", 
                                   "/webjars/**",
                                   "/swagger-resources/**").permitAll()

                    // Permite acesso irrestrito a qualquer rota da API ("/api/**")
                    .requestMatchers("/api/**").permitAll()

                    // Qualquer outra requisição também será permitida (alterar para `authenticated()` caso queira restringir)
                    .anyRequest().permitAll()
            );

        // Define o provedor de autenticação para o Spring Security
        http.authenticationProvider(authenticationProvider());

        // Adiciona o filtro JWT antes do filtro de autenticação padrão do Spring Security
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // Constrói e retorna a configuração de segurança
        return http.build();
    }
}
