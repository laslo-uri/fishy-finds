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

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoyaltyProgramServiceDeleteTest {

    @Mock LoyaltyProgramRepository loyaltyProgramRepository;
    @Mock CustomerRepository customerRepository;
    @Mock BoatOwnerRepository boatOwnerRepostory;
    @Mock InstructorRepository instructorRepository;
    @InjectMocks LoyaltyProgramService loyaltyProgramService;

    @Test
    void deleteLoyaltyRemovesExistingCategory() {
        LoyaltyProgram loyalty = new LoyaltyProgram();
        loyalty.setId(3);
        when(loyaltyProgramRepository.findById(3)).thenReturn(Optional.of(loyalty));

        Map<String, String> message = new HashMap<>();
        message.put("id", "3");
        loyaltyProgramService.deleteLoyalty(message);

        verify(loyaltyProgramRepository).delete(loyalty);
    }

    @Test
    void deleteLoyaltyNoOpsWhenMissing() {
        when(loyaltyProgramRepository.findById(99)).thenReturn(Optional.empty());
        Map<String, String> message = new HashMap<>();
        message.put("id", "99");
        loyaltyProgramService.deleteLoyalty(message);
        verify(loyaltyProgramRepository, never()).delete(any());
    }
}
