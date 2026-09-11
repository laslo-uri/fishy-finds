package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
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

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoyaltyProgramServiceAddNewTest {

    @Mock LoyaltyProgramRepository loyaltyProgramRepository;
    @Mock CustomerRepository customerRepository;
    @Mock BoatOwnerRepository boatOwnerRepostory;
    @Mock InstructorRepository instructorRepository;
    @InjectMocks LoyaltyProgramService loyaltyProgramService;

    @Test
    void addNewLoyaltySavesWhenUnique() {
        when(loyaltyProgramRepository.findAll()).thenReturn(Collections.emptyList());
        Map<String, String> message = new HashMap<>();
        message.put("categoryName", "Platinum");
        message.put("categoryDiscount", "15");
        message.put("earningRate", "2");
        message.put("requiredPoints", "200");

        loyaltyProgramService.addNewLoyalty(message);
        verify(loyaltyProgramRepository).save(any(LoyaltyProgram.class));
    }
}
