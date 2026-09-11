package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.offers.boats.Boat;
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

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoatServiceFindAllTest {

    @Mock BoatRepository boatRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @Mock EngineRepository engineRepository;
    @InjectMocks BoatService boatService;

    @Test
    void findAllReturnsRepositoryContent() {
        Boat boat = new Boat();
        boat.setOfferName("Sailing");
        when(boatRepository.findAll()).thenReturn(Collections.singletonList(boat));

        assertEquals(1, boatService.findAll().size());
        assertEquals("Sailing", boatService.findAll().get(0).getOfferName());
    }
}
