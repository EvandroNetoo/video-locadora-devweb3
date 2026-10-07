package com.locadora.api.item;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ItemRequest(
        @Schema(description = "Número de série único, sem espaços nas extremidades", example = "DVD-0001")
        @NotBlank(message = "Informe o número de série") @Size(max = 120, message = "O número de série deve ter até 120 caracteres") String serialNumber,
        @Schema(description = "Identificador de um título cadastrado", example = "1")
        @NotNull(message = "Informe o título") @Positive(message = "O identificador do título deve ser positivo") Long titleId,
        @Schema(example = "2026-10-07")
        @NotNull(message = "Informe a data de aquisição") LocalDate acquisitionDate,
        @Schema(description = "Tipo de mídia física: FITA, DVD ou BLU_RAY", example = "DVD")
        @NotNull(message = "Informe o tipo do item") ItemType type) {
}
