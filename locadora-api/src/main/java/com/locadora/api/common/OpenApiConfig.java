package com.locadora.api.common;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI locadoraOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Locadora API")
                .version("1.0.0")
                .description("Cadastro de atores, diretores, classes, títulos e itens físicos. "
                        + "Erros retornam message; erros de validação também retornam fields. "
                        + "Referências inexistentes retornam 404 e conflitos de vínculos ou número de série retornam 409."));
    }
}
