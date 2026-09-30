package com.locadora.api.ator;

import com.locadora.api.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AtorService {
    private final AtorRepository repository;

    public AtorService(AtorRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    public List<AtorResponse> list() {
        return repository.findAll(Sort.by("name")).stream().map(AtorResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AtorResponse get(Long id) { return AtorResponse.from(find(id)); }

    @Transactional
    public AtorResponse create(AtorRequest request) {
        return AtorResponse.from(repository.save(new Ator(request.name().trim())));
    }

    @Transactional
    public AtorResponse update(Long id, AtorRequest request) {
        Ator ator = find(id);
        ator.setName(request.name().trim());
        return AtorResponse.from(ator);
    }

    @Transactional
    public void delete(Long id) { repository.delete(find(id)); repository.flush(); }

    private Ator find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ator não encontrado"));
    }
}
