package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
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

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BungalowServiceFindByIdTest {

    @Mock BungalowRepository bungalowRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @Mock ImageItemRepository imageItemRepository;
    @InjectMocks BungalowService bungalowService;

    @Test
    void findByBungalowIdReturnsMatch() {
        Bungalow bungalow = new Bungalow();
        bungalow.setId(7L);
        when(bungalowRepository.findAll()).thenReturn(Collections.singletonList(bungalow));
        assertSame(bungalow, bungalowService.findByBungalowId(7L));
    }

    @Test
    void findByBungalowIdReturnsNullWhenMissing() {
        when(bungalowRepository.findAll()).thenReturn(Collections.emptyList());
        assertNull(bungalowService.findByBungalowId(1L));
    }
}
