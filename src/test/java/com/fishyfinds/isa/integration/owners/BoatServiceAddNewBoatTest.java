package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.dto.AddNewBoatDTO;
import com.fishyfinds.isa.repository.LocationRepository;
import com.fishyfinds.isa.repository.offers.BoatRepository;
import com.fishyfinds.isa.repository.offers.EngineRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.offers.BoatService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoatServiceAddNewBoatTest {

    @Mock BoatRepository boatRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @Mock EngineRepository engineRepository;
    @InjectMocks BoatService boatService;

    @Test
    void addNewBoatReturnsFalseWhenUserMissing() {
        when(userRepository.findByEmail("missing@x.com")).thenReturn(null);
        assertFalse(boatService.addNewBoat(new AddNewBoatDTO(), "missing@x.com"));
        verify(boatRepository, never()).saveAndFlush(any());
    }
}
