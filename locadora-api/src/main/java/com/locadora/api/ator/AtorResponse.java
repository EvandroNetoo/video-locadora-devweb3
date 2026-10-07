package com.locadora.api.ator;

public record AtorResponse(Long id, String name) {
    public static AtorResponse from(Ator ator) {
        return new AtorResponse(ator.getId(), ator.getName());
    }
}
