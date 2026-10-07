package com.locadora.api.titulo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record TituloRequest(
        @Schema(example = "Interestelar")
        @NotBlank(message = "Informe o nome do título") @Size(max = 200, message = "O nome deve ter até 200 caracteres") String name,
        @Schema(example = "2014")
        @NotNull(message = "Informe o ano") @Min(value = 1, message = "O ano deve ser positivo") @Max(value = 9999, message = "O ano deve ter até quatro dígitos") Integer year,
        @Schema(example = "Uma equipe de exploradores viaja pelo espaço.")
        @NotBlank(message = "Informe a sinopse") @Size(max = 5000, message = "A sinopse deve ter até 5000 caracteres") String synopsis,
        @Schema(example = "Ficção científica")
        @NotBlank(message = "Informe a categoria") @Size(max = 120, message = "A categoria deve ter até 120 caracteres") String category,
        @Schema(description = "Identificador de um diretor cadastrado", example = "1")
        @NotNull(message = "Informe o diretor") @Positive(message = "O identificador do diretor deve ser positivo") Long directorId,
        @Schema(description = "Identificador de uma classe cadastrada", example = "1")
        @NotNull(message = "Informe a classe") @Positive(message = "O identificador da classe deve ser positivo") Long classId,
        @Schema(description = "Identificadores dos atores cadastrados", example = "[1, 2]")
        @NotEmpty(message = "Informe pelo menos um ator") Set<@NotNull(message = "Informe o ator") @Positive(message = "O identificador do ator deve ser positivo") Long> actorIds) {
}
