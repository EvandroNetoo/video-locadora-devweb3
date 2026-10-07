package com.locadora.api.item;

import com.locadora.api.titulo.Titulo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "itens")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 120)
    private String serialNumber;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "titulo_id", nullable = false)
    private Titulo title;
    @Column(nullable = false)
    private LocalDate acquisitionDate;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ItemType type;

    protected Item() {
    }

    public Item(String serialNumber, Titulo title, LocalDate acquisitionDate, ItemType type) {
        update(serialNumber, title, acquisitionDate, type);
    }

    public Long getId() { return id; }
    public String getSerialNumber() { return serialNumber; }
    public Titulo getTitle() { return title; }
    public LocalDate getAcquisitionDate() { return acquisitionDate; }
    public ItemType getType() { return type; }

    public void update(String serialNumber, Titulo title, LocalDate acquisitionDate, ItemType type) {
        this.serialNumber = serialNumber;
        this.title = title;
        this.acquisitionDate = acquisitionDate;
        this.type = type;
    }
}
