package com.fishyfinds.isa.repository.offers;

import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.offers.OfferUnavailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferUnavailabilityRepository extends JpaRepository<OfferUnavailability, Long> {

    List<OfferUnavailability> findAllByOffer(Offer offer);

    List<OfferUnavailability> findAllByOfferId(Long offerId);
}
