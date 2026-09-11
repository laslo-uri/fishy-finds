package com.fishyfinds.isa.model.beans.offers;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "OfferUnavailability")
public class OfferUnavailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "offer", referencedColumnName = "id", nullable = false)
    private Offer offer;

    @Column(name = "startDate", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "endDate", nullable = false)
    private LocalDateTime endDate;

    public OfferUnavailability() {}

    public OfferUnavailability(Offer offer, LocalDateTime startDate, LocalDateTime endDate) {
        this.offer = offer;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
