package com.locadora.api.item;

import java.time.LocalDate;

public record ItemResponse(Long id, String serialNumber, Long titleId, String titleName,
        LocalDate acquisitionDate, ItemType type) {
    public static ItemResponse from(Item item) {
        return new ItemResponse(item.getId(), item.getSerialNumber(), item.getTitle().getId(),
                item.getTitle().getName(), item.getAcquisitionDate(), item.getType());
    }
}
