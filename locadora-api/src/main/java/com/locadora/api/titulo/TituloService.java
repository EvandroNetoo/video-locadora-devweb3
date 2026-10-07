package com.locadora.api.titulo;

import com.locadora.api.ator.Ator;
import com.locadora.api.ator.AtorRepository;
import com.locadora.api.classe.Classe;
import com.locadora.api.classe.ClasseRepository;
import com.locadora.api.common.ResourceNotFoundException;
import com.locadora.api.common.ResourceConflictException;
import com.locadora.api.diretor.Diretor;
import com.locadora.api.diretor.DiretorRepository;
import com.locadora.api.item.ItemRepository;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TituloService {
    private final TituloRepository repository;
    private final DiretorRepository diretorRepository;
    private final ClasseRepository classeRepository;
    private final AtorRepository atorRepository;
    private final ItemRepository itemRepository;

    public TituloService(TituloRepository repository, DiretorRepository diretorRepository,
            ClasseRepository classeRepository, AtorRepository atorRepository, ItemRepository itemRepository) {
        this.repository = repository;
        this.diretorRepository = diretorRepository;
        this.classeRepository = classeRepository;
        this.atorRepository = atorRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<TituloResponse> list(String name, String category, Long actorId) {
        return repository.search(name == null ? null : name.trim(), category == null ? null : category.trim(), actorId)
                .stream().map(TituloResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TituloResponse get(Long id) {
        return TituloResponse.from(find(id));
    }

    @Transactional
    public TituloResponse create(TituloRequest request) {
        return TituloResponse.from(repository.save(new Titulo(request.name().trim(), request.year(),
                request.synopsis().trim(), request.category().trim(), director(request.directorId()),
                rentalClass(request.classId()), actors(request.actorIds()))));
    }

    @Transactional
    public TituloResponse update(Long id, TituloRequest request) {
        Titulo titulo = find(id);
        titulo.update(request.name().trim(), request.year(), request.synopsis().trim(), request.category().trim(),
                director(request.directorId()), rentalClass(request.classId()), actors(request.actorIds()));
        return TituloResponse.from(titulo);
    }

    @Transactional
    public void delete(Long id) {
        Titulo titulo = find(id);
        if (itemRepository.existsByTitleId(id)) {
            throw new ResourceConflictException("O título possui itens e não pode ser excluído");
        }
        repository.delete(titulo);
        repository.flush();
    }

    private Titulo find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Título não encontrado"));
    }

    private Diretor director(Long id) {
        return diretorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Diretor não encontrado"));
    }

    private Classe rentalClass(Long id) {
        return classeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Classe não encontrada"));
    }

    private Set<Ator> actors(Set<Long> ids) {
        Set<Ator> actors = new LinkedHashSet<>();
        for (Long id : ids) {
            actors.add(atorRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Ator não encontrado: " + id)));
        }
        return actors;
    }
}
