package com.locadora.api.titulo;

import com.locadora.api.ator.Ator;
import com.locadora.api.classe.Classe;
import com.locadora.api.diretor.Diretor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "titulos")
public class Titulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(name = "release_year", nullable = false)
    private Integer year;
    @Column(nullable = false, length = 5000)
    private String synopsis;
    @Column(nullable = false, length = 120)
    private String category;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "diretor_id", nullable = false)
    private Diretor director;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe rentalClass;
    @ManyToMany
    @JoinTable(name = "titulo_atores", joinColumns = @JoinColumn(name = "titulo_id"),
            inverseJoinColumns = @JoinColumn(name = "ator_id"))
    private Set<Ator> actors = new LinkedHashSet<>();

    protected Titulo() {
    }

    public Titulo(String name, Integer year, String synopsis, String category,
            Diretor director, Classe rentalClass, Set<Ator> actors) {
        update(name, year, synopsis, category, director, rentalClass, actors);
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Integer getYear() { return year; }
    public String getSynopsis() { return synopsis; }
    public String getCategory() { return category; }
    public Diretor getDirector() { return director; }
    public Classe getRentalClass() { return rentalClass; }
    public Set<Ator> getActors() { return actors; }

    public void update(String name, Integer year, String synopsis, String category,
            Diretor director, Classe rentalClass, Set<Ator> actors) {
        this.name = name;
        this.year = year;
        this.synopsis = synopsis;
        this.category = category;
        this.director = director;
        this.rentalClass = rentalClass;
        this.actors.clear();
        this.actors.addAll(actors);
    }
}
