package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.users.User;
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

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoatServiceFindAllByOwnerTest {

    @Mock BoatRepository boatRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @Mock EngineRepository engineRepository;
    @InjectMocks BoatService boatService;

    @Test
    void findAllByOwnerIdFiltersOwnerBoats() {
        User owner = new User();
        owner.setId(2L);
        User other = new User();
        other.setId(9L);

        Boat mine = new Boat();
        mine.setUser(owner);
        Boat theirs = new Boat();
        theirs.setUser(other);
        when(boatRepository.findAll()).thenReturn(Arrays.asList(mine, theirs));

        List<Boat> result = boatService.findAllByOwnerId(2L);
        assertEquals(1, result.size());
        assertSame(mine, result.get(0));
    }
}
