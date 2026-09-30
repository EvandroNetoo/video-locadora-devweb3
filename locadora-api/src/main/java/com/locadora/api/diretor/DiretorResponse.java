package com.locadora.api.diretor;

public record DiretorResponse(Long id, String name) {
    public static DiretorResponse from(Diretor diretor) { return new DiretorResponse(diretor.getId(), diretor.getName()); }
}
