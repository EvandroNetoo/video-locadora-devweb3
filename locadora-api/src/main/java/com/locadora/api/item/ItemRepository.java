package com.locadora.api.item;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByTitleId(Long titleId);
    boolean existsBySerialNumber(String serialNumber);
    boolean existsBySerialNumberAndIdNot(String serialNumber, Long id);

    @Query("""
            select i from Item i
            where (:titleId is null or i.title.id = :titleId)
              and (:type is null or i.type = :type)
              and (:serialNumber is null or i.serialNumber = :serialNumber)
            order by i.serialNumber, i.id
            """)
    List<Item> search(Long titleId, ItemType type, String serialNumber);
}
