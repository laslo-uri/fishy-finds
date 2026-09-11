package com.fishyfinds.isa.repository.terms;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import org.apache.tomcat.jni.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query( value = "SELECT * FROM reservation WHERE reservation_type = 1 AND customer IS NULL", nativeQuery = true)
    List<Reservation> findAllUnreservedActions();

    //checking out reservation status == ACTIVE -> not to show cancelled reservations
    @Query( value = "SELECT r.*, u.*, o.* FROM reservation r LEFT OUTER JOIN users u on r.customer = u.id " +
            "LEFT OUTER JOIN offer o on r.offer = o.id WHERE r.end_date<=:dateParam AND u.email = :username AND r.reservation_status = 0", nativeQuery = true)
    List<Reservation> findAllPassedReservationsForCustomer(@Param("username")String username,@Param("dateParam") LocalDateTime dateParam);

    @Query( value = "SELECT r.*, u.*, o.*, 1 as clazz_ FROM reservation r LEFT OUTER JOIN users u on r.customer = u.id " +
            "LEFT OUTER JOIN offer o on r.offer = o.id WHERE r.start_date>=:dateParam AND u.email = :username AND r.reservation_status = 0 ", nativeQuery = true)
    List<Reservation> findAllUpcomingReservationsForUser(@Param("username")String username,@Param("dateParam") LocalDateTime dateParam);

    @Query( value = "SELECT *, 1 as clazz_ FROM reservation r WHERE r.offer = :id AND r.start_date > :dateParam", nativeQuery = true)
    List<Reservation> findAllActionsForOffer(@Param("id")Long id, @Param("dateParam")LocalDateTime dateParam);
}
