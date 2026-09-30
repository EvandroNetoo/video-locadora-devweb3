package com.locadora.api.classe;

import java.math.BigDecimal;

public record ClasseResponse(Long id, String name, BigDecimal price, Integer days) {
    public static ClasseResponse from(Classe classe) {
        return new ClasseResponse(classe.getId(), classe.getName(), classe.getPrice(), classe.getDays());
    }
}
