package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.dto.OfferDTO;
import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OfferDTOTest {

    @Test
    void wrapsOfferFollowFlagAndPath() {
        Bungalow bungalow = new Bungalow();
        bungalow.setOfferName("Sunset");
        OfferDTO dto = new OfferDTO();
        dto.setOffer(bungalow);
        dto.setFollowed(true);
        dto.setPath("images/first.jpg");

        assertEquals("Sunset", dto.getOffer().getOfferName());
        assertTrue(dto.isFollowed());
        assertEquals("images/first.jpg", dto.getPath());
    }
}
