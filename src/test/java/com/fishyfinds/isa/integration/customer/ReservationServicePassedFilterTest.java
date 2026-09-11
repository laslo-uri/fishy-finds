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

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServicePassedFilterTest {

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
    void filtersActiveWithoutComplaint() {
        Reservation ok = new Reservation();
        ok.setReservationStatus(ReservationStatus.ACTIVE);
        ok.setHasComplaint(false);

        Reservation complained = new Reservation();
        complained.setReservationStatus(ReservationStatus.ACTIVE);
        complained.setHasComplaint(true);

        Reservation cancelled = new Reservation();
        cancelled.setReservationStatus(ReservationStatus.CANCELLED);
        cancelled.setHasComplaint(false);

        when(reservationRepository.findAllPassedReservationsForCustomer(eq("c@x.com"), any()))
                .thenReturn(Arrays.asList(ok, complained, cancelled));

        List<Reservation> result = reservationService.allPassedReservationsForCustomerWithoutDuplicatedOffers("c@x.com");
        assertEquals(1, result.size());
        assertSame(ok, result.get(0));
    }
}
