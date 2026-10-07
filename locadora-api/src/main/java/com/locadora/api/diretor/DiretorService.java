package com.locadora.api.diretor;

import com.locadora.api.common.ResourceNotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiretorService {
    private final DiretorRepository repository;

    public DiretorService(DiretorRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<DiretorResponse> list() {
        return repository.findAll(Sort.by("name")).stream().map(DiretorResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public DiretorResponse get(Long id) {
        return DiretorResponse.from(find(id));
    }

    @Transactional
    public DiretorResponse create(DiretorRequest request) {
        return DiretorResponse.from(repository.save(new Diretor(request.name().trim())));
    }

    @Transactional
    public DiretorResponse update(Long id, DiretorRequest request) {
        Diretor diretor = find(id);
        diretor.setName(request.name().trim());
        return DiretorResponse.from(diretor);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
        repository.flush();
    }

    private Diretor find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Diretor não encontrado"));
    }
}
