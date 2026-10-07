package com.locadora.api.titulo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TituloRepository extends JpaRepository<Titulo, Long> {
    @Query("""
            select t from Titulo t
            where (:name is null or lower(t.name) like lower(concat('%', :name, '%')))
              and (:category is null or lower(t.category) = lower(:category))
              and (:actorId is null or exists (select a.id from t.actors a where a.id = :actorId))
            order by t.name, t.id
            """)
    List<Titulo> search(String name, String category, Long actorId);
}
