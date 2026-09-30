package com.locadora.api.classe;

import com.locadora.api.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClasseService {
    private final ClasseRepository repository;

    public ClasseService(ClasseRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    public List<ClasseResponse> list() {
        return repository.findAll(Sort.by("name")).stream().map(ClasseResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ClasseResponse get(Long id) { return ClasseResponse.from(find(id)); }

    @Transactional
    public ClasseResponse create(ClasseRequest request) {
        return ClasseResponse.from(repository.save(new Classe(request.name().trim(), request.price(), request.days())));
    }

    @Transactional
    public ClasseResponse update(Long id, ClasseRequest request) {
        Classe classe = find(id);
        classe.update(request.name().trim(), request.price(), request.days());
        return ClasseResponse.from(classe);
    }

    @Transactional
    public void delete(Long id) { repository.delete(find(id)); repository.flush(); }

    private Classe find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Classe não encontrada"));
    }
}
