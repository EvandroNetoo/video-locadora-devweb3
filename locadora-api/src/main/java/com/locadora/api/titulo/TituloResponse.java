package com.locadora.api.titulo;

import com.locadora.api.ator.AtorResponse;
import com.locadora.api.classe.ClasseResponse;
import com.locadora.api.diretor.DiretorResponse;
import java.util.Comparator;
import java.util.List;

public record TituloResponse(Long id, String name, Integer year, String synopsis, String category,
        DiretorResponse director, ClasseResponse rentalClass, List<AtorResponse> actors) {
    public static TituloResponse from(Titulo titulo) {
        return new TituloResponse(titulo.getId(), titulo.getName(), titulo.getYear(), titulo.getSynopsis(),
                titulo.getCategory(), DiretorResponse.from(titulo.getDirector()),
                ClasseResponse.from(titulo.getRentalClass()), titulo.getActors().stream()
                        .map(AtorResponse::from).sorted(Comparator.comparing(AtorResponse::name).thenComparing(AtorResponse::id)).toList());
    }
}
