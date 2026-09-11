package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.users.BoatOwnerRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.repository.users.InstructorRepository;
import com.fishyfinds.isa.service.LoyaltyProgramService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoyaltyProgramServiceSetCustomerTest {

    @Mock LoyaltyProgramRepository loyaltyProgramRepository;
    @Mock CustomerRepository customerRepository;
    @Mock BoatOwnerRepository boatOwnerRepostory;
    @Mock InstructorRepository instructorRepository;
    @InjectMocks LoyaltyProgramService loyaltyProgramService;

    @Test
    void setLoyaltyToCustomerPersistsCustomer() {
        Customer customer = new Customer();
        LoyaltyProgram loyalty = new LoyaltyProgram();
        loyalty.setCategoryName("Gold");

        assertTrue(loyaltyProgramService.setLoyaltyToCustomer(customer, loyalty));
        assertEquals("Gold", customer.getLoyaltyProgram().getCategoryName());
        verify(customerRepository).save(customer);
    }
}
