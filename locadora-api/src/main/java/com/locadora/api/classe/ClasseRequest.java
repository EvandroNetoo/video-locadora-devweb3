package com.locadora.api.classe;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ClasseRequest(
    @NotBlank(message = "Informe o nome da classe") @Size(max = 120, message = "O nome deve ter até 120 caracteres") String name,
    @NotNull(message = "Informe o valor da locação") @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero") @Digits(integer = 10, fraction = 2, message = "Use no máximo duas casas decimais") BigDecimal price,
    @NotNull(message = "Informe o prazo") @Min(value = 1, message = "O prazo deve ser de pelo menos um dia") @Max(value = 3650, message = "O prazo deve ser de no máximo 3650 dias") Integer days
) {}
