package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.enums.ReservationStatus;
import com.fishyfinds.isa.model.enums.ReservationType;
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

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceActionsTest {

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
    void getActionsForOfferKeepsOnlyQuickOpenActions() {
        Reservation quickOpen = new Reservation();
        quickOpen.setReservationType(ReservationType.QUICK);
        quickOpen.setReservationStatus(ReservationStatus.ACTIVE);
        quickOpen.setCustomer(null);

        Reservation quickTaken = new Reservation();
        quickTaken.setReservationType(ReservationType.QUICK);
        quickTaken.setReservationStatus(ReservationStatus.ACTIVE);
        quickTaken.setCustomer(new com.fishyfinds.isa.model.beans.users.customers.Customer());

        Reservation regular = new Reservation();
        regular.setReservationType(ReservationType.DEFAULT);
        regular.setReservationStatus(ReservationStatus.CANCELLED);

        when(reservationRepository.findAllActionsForOffer(eq(5L), any()))
                .thenReturn(Arrays.asList(quickOpen, quickTaken, regular));

        List<Reservation> actions = reservationService.getActionsForOffer(5L);
        assertEquals(1, actions.size());
        assertSame(quickOpen, actions.get(0));
    }
}
