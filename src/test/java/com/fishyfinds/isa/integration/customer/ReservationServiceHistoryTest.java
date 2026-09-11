package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.terms.Reservation;
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

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceHistoryTest {

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
    void historyReturnsEmptyListWhenRepositoryReturnsNull() {
        when(reservationRepository.findAllPassedReservationsForCustomer(eq("a@b.com"), any())).thenReturn(null);
        List<Reservation> result = reservationService.historyOfReservationsForCustomer("a@b.com");
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void historyReturnsRepositoryList() {
        Reservation r = new Reservation();
        when(reservationRepository.findAllPassedReservationsForCustomer(eq("a@b.com"), any()))
                .thenReturn(Collections.singletonList(r));
        assertEquals(1, reservationService.historyOfReservationsForCustomer("a@b.com").size());
    }
}
