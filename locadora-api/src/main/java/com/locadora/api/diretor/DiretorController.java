package com.locadora.api.diretor;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diretores")
public class DiretorController {
    private final DiretorService service;

    public DiretorController(DiretorService service) { this.service = service; }

    @GetMapping
    public List<DiretorResponse> list() { return service.list(); }

    @GetMapping("/{id}")
    public DiretorResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public ResponseEntity<DiretorResponse> create(@Valid @RequestBody DiretorRequest request) {
        DiretorResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/diretores/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public DiretorResponse update(@PathVariable Long id, @Valid @RequestBody DiretorRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
