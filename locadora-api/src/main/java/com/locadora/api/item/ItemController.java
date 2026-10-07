package com.locadora.api.item;

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
@RequestMapping("/api/itens")
@Tag(name = "Itens físicos")
public class ItemController {
    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    @Operation(summary = "Listar itens físicos", description = "Filtros opcionais podem ser combinados.")
    @ApiResponse(responseCode = "200", description = "Lista de registros")
    @ApiResponse(responseCode = "400", description = "Filtro inválido", content = @Content)
    @GetMapping
    public List<ItemResponse> list(
            @Parameter(description = "Identificador do título") @RequestParam(required = false) Long titleId,
            @Parameter(description = "Tipo de mídia física") @RequestParam(required = false) ItemType type,
            @Parameter(description = "Número de série exato") @RequestParam(required = false) String serialNumber) {
        return service.list(titleId, type, serialNumber);
    }

    @Operation(summary = "Obter item por identificador")
    @ApiResponse(responseCode = "200", description = "Registro encontrado")
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @GetMapping("/{id}")
    public ItemResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @Operation(summary = "Cadastrar item físico")
    @ApiResponse(responseCode = "201", description = "Registro criado; Location contém o endereço do registro")
    @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Referência não encontrada", content = @Content)
    @ApiResponse(responseCode = "409", description = "Conflito de integridade", content = @Content)
    @PostMapping
    public ResponseEntity<ItemResponse> create(@Valid @RequestBody ItemRequest request) {
        ItemResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/itens/" + response.id())).body(response);
    }

    @Operation(summary = "Alterar item físico")
    @ApiResponse(responseCode = "200", description = "Registro atualizado")
    @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content)
    @ApiResponse(responseCode = "404", description = "Registro ou referência não encontrado", content = @Content)
    @ApiResponse(responseCode = "409", description = "Conflito de integridade", content = @Content)
    @PutMapping("/{id}")
    public ItemResponse update(@PathVariable Long id, @Valid @RequestBody ItemRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Excluir item físico")
    @ApiResponse(responseCode = "204", description = "Registro excluído", content = @Content)
    @ApiResponse(responseCode = "404", description = "Registro não encontrado", content = @Content)
    @ApiResponse(responseCode = "409", description = "Registro possui vínculos", content = @Content)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
