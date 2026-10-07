package com.locadora.api.ator;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtorRequest(
        @NotBlank(message = "Informe o nome do ator") @Size(max = 120, message = "O nome deve ter até 120 caracteres") String name) {
}
