package com.fishyfinds.isa.repository.terms;

import com.fishyfinds.isa.model.beans.terms.CancelledReservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CancelledReservationRepository extends JpaRepository<CancelledReservation, Long> {
}
