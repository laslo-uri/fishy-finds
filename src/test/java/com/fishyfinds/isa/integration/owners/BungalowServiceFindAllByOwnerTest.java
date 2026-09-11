package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.repository.LocationRepository;
import com.fishyfinds.isa.repository.offers.BungalowRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.users.ImageItemRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.offers.BungalowService;
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
class BungalowServiceFindAllByOwnerTest {

    @Mock BungalowRepository bungalowRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @Mock ImageItemRepository imageItemRepository;
    @InjectMocks BungalowService bungalowService;

    @Test
    void findAllByOwnerIdReturnsOnlyOwned() {
        User owner = new User();
        owner.setId(1L);
        Bungalow b1 = new Bungalow();
        b1.setUser(owner);
        Bungalow b2 = new Bungalow();
        User other = new User();
        other.setId(3L);
        b2.setUser(other);
        when(bungalowRepository.findAll()).thenReturn(Arrays.asList(b1, b2));

        List<Bungalow> result = bungalowService.findAllByOwnerId(1L);
        assertEquals(1, result.size());
    }
}
