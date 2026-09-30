package com.locadora.api.classe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "classes")
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String name;
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal price;
    @Column(nullable = false)
    private Integer days;

    protected Classe() {}

    public Classe(String name, BigDecimal price, Integer days) {
        this.name = name;
        this.price = price;
        this.days = days;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public Integer getDays() { return days; }
    public void update(String name, BigDecimal price, Integer days) {
        this.name = name;
        this.price = price;
        this.days = days;
    }
}
