package com.locadora.api.classe;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Classes")
@RequestMapping("/api/classes")
public class ClasseController {
    private final ClasseService service;

    public ClasseController(ClasseService service) {
        this.service = service;
    }

    @Operation(summary = "Listar classes")
    @ApiResponse(responseCode = "200", description = "Lista de registros")
    @GetMapping
    public List<ClasseResponse> list() {
        return service.list();
    }

    @Operation(summary = "Obter classe por identificador")
    @ApiResponse(responseCode = "200", description = "Registro encontrado")
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @GetMapping("/{id}")
    public ClasseResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @Operation(summary = "Cadastrar classe")
    @ApiResponse(responseCode = "201", description = "Registro criado; Location contém o endereço do registro")
    @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    @PostMapping
    public ResponseEntity<ClasseResponse> create(@Valid @RequestBody ClasseRequest request) {
        ClasseResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/classes/" + response.id())).body(response);
    }

    @Operation(summary = "Alterar classe")
    @ApiResponse(responseCode = "200", description = "Registro atualizado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @PutMapping("/{id}")
    public ClasseResponse update(@PathVariable Long id, @Valid @RequestBody ClasseRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Excluir classe", description = "A exclusão é bloqueada quando existem títulos relacionados.")
    @ApiResponse(responseCode = "204", description = "Registro excluído", content = @Content)
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @ApiResponse(responseCode = "409", description = "Registro possui vínculos", content = @Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
