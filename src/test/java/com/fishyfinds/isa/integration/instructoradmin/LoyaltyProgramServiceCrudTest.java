package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.users.BoatOwnerRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.repository.users.InstructorRepository;
import com.fishyfinds.isa.service.LoyaltyProgramService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoyaltyProgramServiceCrudTest {

    @Mock LoyaltyProgramRepository loyaltyProgramRepository;
    @Mock CustomerRepository customerRepository;
    @Mock BoatOwnerRepository boatOwnerRepostory;
    @Mock InstructorRepository instructorRepository;
    @InjectMocks LoyaltyProgramService loyaltyProgramService;

    @Test
    void addNewLoyaltySavesWhenCategoryIsNew() {
        when(loyaltyProgramRepository.findAll()).thenReturn(Collections.emptyList());

        Map<String, String> message = new HashMap<>();
        message.put("categoryName", "Gold");
        message.put("categoryDiscount", "15");
        message.put("earningRate", "1.5");
        message.put("requiredPoints", "100");

        loyaltyProgramService.addNewLoyalty(message);

        ArgumentCaptor<LoyaltyProgram> captor = ArgumentCaptor.forClass(LoyaltyProgram.class);
        verify(loyaltyProgramRepository).save(captor.capture());
        LoyaltyProgram saved = captor.getValue();
        assertEquals("Gold", saved.getCategoryName());
        assertEquals(15.0, saved.getCategoryDiscount());
        assertEquals(100, saved.getRequiredPoints());
    }

    @Test
    void addNewLoyaltySkipsDuplicateCategoryName() {
        LoyaltyProgram existing = new LoyaltyProgram();
        existing.setCategoryName("Gold");
        when(loyaltyProgramRepository.findAll()).thenReturn(Collections.singletonList(existing));

        Map<String, String> message = new HashMap<>();
        message.put("categoryName", "gold");
        message.put("categoryDiscount", "10");

        loyaltyProgramService.addNewLoyalty(message);
        verify(loyaltyProgramRepository, never()).save(any());
    }

    @Test
    void deleteLoyaltyRemovesExistingCategory() {
        LoyaltyProgram existing = new LoyaltyProgram();
        existing.setCategoryName("Silver");
        when(loyaltyProgramRepository.findById(2)).thenReturn(Optional.of(existing));

        Map<String, String> message = new HashMap<>();
        message.put("id", "2");
        loyaltyProgramService.deleteLoyalty(message);

        verify(loyaltyProgramRepository).delete(existing);
    }
}
