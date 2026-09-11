package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.terms.Term;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.model.enums.ReservationStatus;
import com.fishyfinds.isa.model.enums.ReservationType;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.SubscriberRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.terms.CancelledReservationRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.terms.TermRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.service.MailService;
import com.fishyfinds.isa.service.PenalService;
import com.fishyfinds.isa.service.offers.OfferUnavailabilityService;
import com.fishyfinds.isa.service.terms.CancelledReservationService;
import com.fishyfinds.isa.service.terms.ReservationService;
import com.fishyfinds.isa.model.beans.Penal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceCreateCancelTest {

    @Mock ReservationRepository reservationRepository;
    @Mock TermRepository termRepository;
    @Mock CustomerRepository customerRepository;
    @Mock OfferRepository offerRepository;
    @Mock MailService mailService;
    @Mock PenalService penalService;
    @Mock CancelledReservationRepository cancelledReservationRepositoty;
    @Mock CancelledReservationService cancelledReservationService;
    @Mock LoyaltyProgramRepository lRP;
    @Mock SubscriberRepository subscriberRepository;
    @Mock OfferUnavailabilityService offerUnavailabilityService;
    @InjectMocks ReservationService reservationService;

    @Test
    void makeReservationSucceedsWhenTermFreeAndNoPenalties() throws Exception {
        Customer customer = new Customer();
        customer.setEmail("mail@mail.com");
        customer.setEarnedPoints(0);
        Penal penal = new Penal();
        penal.setNumber(0);
        when(customerRepository.findByEmail("mail@mail.com")).thenReturn(customer);
        when(penalService.getPenalForUser("mail@mail.com")).thenReturn(penal);

        LocalDateTime start = LocalDateTime.now().plusDays(10).withHour(10).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime termStart = start.minusDays(1);
        LocalDateTime termEnd = start.plusDays(10);
        Term term = new Term();
        term.setId(1L);
        term.setStartDate(termStart);
        term.setEndDate(termEnd);
        term.setReservations(new ArrayList<>());
        when(termRepository.findById(1L)).thenReturn(Optional.of(term));

        Offer offer = new Offer();
        offer.setId(5L);
        offer.setUnitPrice(100);
        when(offerRepository.findById(5L)).thenReturn(Optional.of(offer));
        when(cancelledReservationService.findAllPassedReservationsForCustomer("mail@mail.com"))
                .thenReturn(Collections.emptyList());
        when(offerUnavailabilityService.overlaps(eq(5L), any(), any())).thenReturn(false);
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));

        Map<String, String> message = new HashMap<>();
        message.put("startDate", start.toString());
        message.put("duration", "2");
        message.put("termId", "1");
        message.put("offerId", "5");
        message.put("numberOfPeople", "2");
        message.put("additionalServices", "");

        assertTrue(reservationService.makeReservation(message, "mail@mail.com"));
        verify(reservationRepository).save(any(Reservation.class));
        verify(customerRepository).save(customer);
        assertEquals(5, customer.getEarnedPoints());
    }

    @Test
    void cancelReservationFailsWhenTooCloseToStart() {
        Reservation reservation = new Reservation();
        reservation.setId(9L);
        reservation.setStartDate(LocalDateTime.now().plusDays(1));
        when(reservationRepository.findById(9L)).thenReturn(Optional.of(reservation));

        assertFalse(reservationService.cancelReservation(9L));
        verify(cancelledReservationRepositoty, never()).save(any());
    }

    @Test
    void cancelReservationSucceedsWhenMoreThanThreeDaysAway() {
        Reservation reservation = new Reservation();
        reservation.setId(9L);
        reservation.setStartDate(LocalDateTime.now().plusDays(10));
        reservation.setReservationStatus(ReservationStatus.ACTIVE);
        when(reservationRepository.findById(9L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));

        assertTrue(reservationService.cancelReservation(9L));
        assertEquals(ReservationStatus.CANCELLED, reservation.getReservationStatus());
        verify(cancelledReservationRepositoty).save(any());
    }
}
