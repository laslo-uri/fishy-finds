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

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoyaltyProgramServiceAddDuplicateTest {

    @Mock LoyaltyProgramRepository loyaltyProgramRepository;
    @Mock CustomerRepository customerRepository;
    @Mock BoatOwnerRepository boatOwnerRepostory;
    @Mock InstructorRepository instructorRepository;
    @InjectMocks LoyaltyProgramService loyaltyProgramService;

    @Test
    void addNewLoyaltySkipsWhenCategoryExists() {
        LoyaltyProgram existing = new LoyaltyProgram();
        existing.setCategoryName("Gold");
        when(loyaltyProgramRepository.findAll()).thenReturn(Collections.singletonList(existing));

        Map<String, String> message = new HashMap<>();
        message.put("categoryName", "gold");
        message.put("categoryDiscount", "10");
        message.put("earningRate", "1");
        message.put("requiredPoints", "100");

        loyaltyProgramService.addNewLoyalty(message);
        verify(loyaltyProgramRepository, never()).save(any());
    }
}
