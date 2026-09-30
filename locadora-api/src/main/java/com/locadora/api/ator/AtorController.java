package com.locadora.api.ator;

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
@RequestMapping("/api/atores")
public class AtorController {
    private final AtorService service;

    public AtorController(AtorService service) { this.service = service; }

    @GetMapping
    public List<AtorResponse> list() { return service.list(); }

    @GetMapping("/{id}")
    public AtorResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public ResponseEntity<AtorResponse> create(@Valid @RequestBody AtorRequest request) {
        AtorResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/atores/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public AtorResponse update(@PathVariable Long id, @Valid @RequestBody AtorRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
