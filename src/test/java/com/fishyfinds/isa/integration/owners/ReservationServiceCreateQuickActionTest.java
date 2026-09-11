package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.User;
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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceCreateQuickActionTest {

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
    void createQuickActionRejectsNonOwner() {
        User other = new User();
        other.setEmail("other@mail.com");
        Offer offer = new Offer();
        offer.setId(3L);
        offer.setUser(other);
        when(offerRepository.findById(3L)).thenReturn(Optional.of(offer));

        Map<String, String> message = new HashMap<>();
        message.put("offerId", "3");
        message.put("startDate", LocalDateTime.now().plusDays(5).toString());
        message.put("duration", "2");

        assertFalse(reservationService.createQuickAction(message, "zokaMagic@mail.com"));
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createQuickActionPersistsQuickReservationForOwner() {
        User owner = new User();
        owner.setEmail("zokaMagic@mail.com");
        Offer offer = new Offer();
        offer.setId(3L);
        offer.setUnitPrice(80);
        offer.setUser(owner);
        when(offerRepository.findById(3L)).thenReturn(Optional.of(offer));
        when(reservationRepository.findAll()).thenReturn(Collections.emptyList());
        when(subscriberRepository.findAllByFollowing(offer)).thenReturn(Collections.emptyList());
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime start = LocalDateTime.now().plusDays(7).withNano(0);
        Map<String, String> message = new HashMap<>();
        message.put("offerId", "3");
        message.put("startDate", start.toString());
        message.put("duration", "3");
        message.put("numberOfPeople", "4");
        message.put("totalPrice", "200");
        message.put("discount", "10");
        message.put("additionalServices", "bait");

        assertTrue(reservationService.createQuickAction(message, "zokaMagic@mail.com"));

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        Reservation saved = captor.getValue();
        assertEquals(ReservationType.QUICK, saved.getReservationType());
        assertEquals(ReservationStatus.ACTIVE, saved.getReservationStatus());
        assertNull(saved.getCustomer());
        assertEquals(3, saved.getDuration());
        assertEquals(10.0, saved.getDiscount());
        assertEquals(offer, saved.getOffer());
    }
}
