package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.enums.ReservationStatus;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.terms.CancelledReservationRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.terms.TermRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.service.MailService;
import com.fishyfinds.isa.service.PenalService;
import com.fishyfinds.isa.service.terms.CancelledReservationService;
import com.fishyfinds.isa.service.terms.ReservationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceCancelTest {

    @Mock ReservationRepository reservationRepository;
    @Mock TermRepository termRepository;
    @Mock CustomerRepository customerRepository;
    @Mock OfferRepository offerRepository;
    @Mock MailService mailService;
    @Mock PenalService penalService;
    @Mock CancelledReservationRepository cancelledReservationRepositoty;
    @Mock CancelledReservationService cancelledReservationService;
    @Mock LoyaltyProgramRepository lRP;
    @InjectMocks ReservationService reservationService;

    @Test
    void cancelReturnsFalseWhenReservationMissing() {
        when(reservationRepository.findById(99L)).thenReturn(Optional.empty());
        assertFalse(reservationService.cancelReservation(99L));
    }

    @Test
    void cancelSucceedsWhenMoreThanThreeDaysBeforeStart() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setStartDate(LocalDateTime.now().plusDays(10));
        reservation.setReservationStatus(ReservationStatus.ACTIVE);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertTrue(reservationService.cancelReservation(1L));
        assertEquals(ReservationStatus.CANCELLED, reservation.getReservationStatus());
        verify(reservationRepository).save(reservation);
        verify(cancelledReservationRepositoty).save(any());
    }
}
