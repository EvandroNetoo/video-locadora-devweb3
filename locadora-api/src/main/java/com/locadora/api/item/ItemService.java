package com.locadora.api.item;

import com.locadora.api.common.ResourceConflictException;
import com.locadora.api.common.ResourceNotFoundException;
import com.locadora.api.titulo.Titulo;
import com.locadora.api.titulo.TituloRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemService {
    private final ItemRepository repository;
    private final TituloRepository tituloRepository;

    public ItemService(ItemRepository repository, TituloRepository tituloRepository) {
        this.repository = repository;
        this.tituloRepository = tituloRepository;
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> list(Long titleId, ItemType type, String serialNumber) {
        return repository.search(titleId, type, serialNumber == null ? null : serialNumber.trim())
                .stream().map(ItemResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ItemResponse get(Long id) {
        return ItemResponse.from(find(id));
    }

    @Transactional
    public ItemResponse create(ItemRequest request) {
        String serialNumber = request.serialNumber().trim();
        if (repository.existsBySerialNumber(serialNumber)) {
            throw new ResourceConflictException("O número de série já está cadastrado");
        }
        return ItemResponse.from(repository.save(new Item(serialNumber, title(request.titleId()),
                request.acquisitionDate(), request.type())));
    }

    @Transactional
    public ItemResponse update(Long id, ItemRequest request) {
        Item item = find(id);
        String serialNumber = request.serialNumber().trim();
        if (repository.existsBySerialNumberAndIdNot(serialNumber, id)) {
            throw new ResourceConflictException("O número de série já está cadastrado");
        }
        item.update(serialNumber, title(request.titleId()), request.acquisitionDate(), request.type());
        return ItemResponse.from(item);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
        repository.flush();
    }

    private Item find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));
    }

    private Titulo title(Long id) {
        return tituloRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Título não encontrado"));
    }
}
