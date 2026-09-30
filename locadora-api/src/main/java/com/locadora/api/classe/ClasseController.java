package com.locadora.api.classe;

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
@RequestMapping("/api/classes")
public class ClasseController {
    private final ClasseService service;

    public ClasseController(ClasseService service) { this.service = service; }

    @GetMapping
    public List<ClasseResponse> list() { return service.list(); }

    @GetMapping("/{id}")
    public ClasseResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public ResponseEntity<ClasseResponse> create(@Valid @RequestBody ClasseRequest request) {
        ClasseResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/classes/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ClasseResponse update(@PathVariable Long id, @Valid @RequestBody ClasseRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
