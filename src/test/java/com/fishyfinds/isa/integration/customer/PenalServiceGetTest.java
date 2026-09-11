package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.repository.PenalRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.PenalService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PenalServiceGetTest {

    @Mock PenalRepository penalRepository;
    @Mock UserRepository userRepository;
    @InjectMocks PenalService penalService;

    @Test
    void getPenalForUserLoadsCustomerThenPenal() {
        Customer customer = new Customer();
        customer.setEmail("c@test.com");
        Penal penal = new Penal();
        penal.setNumber(1);
        when(userRepository.findByEmail("c@test.com")).thenReturn(customer);
        when(penalRepository.findByCustomer(customer)).thenReturn(penal);

        Penal result = penalService.getPenalForUser("c@test.com");
        assertEquals(1, result.getNumber());
        verify(penalRepository).findByCustomer(customer);
    }
}
