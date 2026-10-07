package com.locadora.api.titulo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/titulos")
@Tag(name = "Títulos")
public class TituloController {
    private final TituloService service;

    public TituloController(TituloService service) {
        this.service = service;
    }

    @Operation(summary = "Listar títulos", description = "Filtros opcionais podem ser combinados.")
    @ApiResponse(responseCode = "200", description = "Lista de registros")
    @ApiResponse(responseCode = "400", description = "Filtro inválido", content = @Content)
    @GetMapping
    public List<TituloResponse> list(
            @Parameter(description = "Trecho do nome, sem diferenciar maiúsculas de minúsculas") @RequestParam(required = false) String name,
            @Parameter(description = "Categoria exata, sem diferenciar maiúsculas de minúsculas") @RequestParam(required = false) String category,
            @Parameter(description = "Identificador de um ator do elenco") @RequestParam(required = false) Long actorId) {
        return service.list(name, category, actorId);
    }

    @Operation(summary = "Obter título por identificador")
    @ApiResponse(responseCode = "200", description = "Registro encontrado")
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @GetMapping("/{id}")
    public TituloResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @Operation(summary = "Cadastrar título")
    @ApiResponse(responseCode = "201", description = "Registro criado; Location contém o endereço do registro")
    @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Referência não encontrada", content = @Content)
    @ApiResponse(responseCode = "409", description = "Conflito de integridade", content = @Content)
    @PostMapping
    public ResponseEntity<TituloResponse> create(@Valid @RequestBody TituloRequest request) {
        TituloResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/titulos/" + response.id())).body(response);
    }

    @Operation(summary = "Alterar título")
    @ApiResponse(responseCode = "200", description = "Registro atualizado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Registro ou referência não encontrado", content = @Content)
    @ApiResponse(responseCode = "409", description = "Conflito de integridade", content = @Content)
    @PutMapping("/{id}")
    public TituloResponse update(@PathVariable Long id, @Valid @RequestBody TituloRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Excluir título", description = "A exclusão é bloqueada quando o título possui itens.")
    @ApiResponse(responseCode = "204", description = "Registro excluído", content = @Content)
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @ApiResponse(responseCode = "409", description = "Registro possui vínculos", content = @Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
