package com.fishyfinds.isa.repository.terms;

import com.fishyfinds.isa.model.beans.terms.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TermRepository extends JpaRepository<Term, Long> {

    @Query(value = "SELECT * from term t, reservation " +
            "r where t.id = :id and r.reservation = :id and r.start_date between :startDate and :endDate or " +
            "r.end_date between :startDate and :endDate", nativeQuery = true)
    List<Term> checkIfReservationIsAvailable(@Param("id")long id, @Param("startDate")LocalDateTime startDate,
                                             @Param("endDate")LocalDateTime endDate);

    @Query(value = "SELECT * term t, reservation r where t.id = r.reservation and r.reservation = :reservationID", nativeQuery = true)
    Term findTermByReservation(@Param("reservationID")long id);
}
