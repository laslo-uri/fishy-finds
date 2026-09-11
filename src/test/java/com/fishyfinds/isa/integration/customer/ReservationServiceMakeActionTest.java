package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceMakeActionTest {

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
    void makeReservationActionFailsWhenTooManyPenals() {
        Customer customer = new Customer();
        customer.setEmail("c@test.com");
        when(customerRepository.findByEmail("c@test.com")).thenReturn(customer);
        Penal penal = new Penal();
        penal.setNumber(5);
        when(penalService.getPenalForUser("c@test.com")).thenReturn(penal);

        assertFalse(reservationService.makeReservationAction(1L, "c@test.com"));
        verify(reservationRepository, never()).findById(any());
    }
}
