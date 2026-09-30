package com.locadora.api.diretor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DiretorRequest(@NotBlank(message = "Informe o nome do diretor") @Size(max = 120, message = "O nome deve ter até 120 caracteres") String name) {}
