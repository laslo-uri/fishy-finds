package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.enums.OfferType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BungalowBeanTest {

    @Test
    void roomsAndBeds() {
        Bungalow bungalow = new Bungalow();
        bungalow.setOfferName("Pine Lodge");
        bungalow.setOfferType(OfferType.BUNGALOW);
        bungalow.setNumberOfRooms(3);
        bungalow.setNumberOfBeds(5);
        bungalow.setUnitPrice(100);

        assertEquals("Pine Lodge", bungalow.getOfferName());
        assertEquals(OfferType.BUNGALOW, bungalow.getOfferType());
        assertEquals(3, bungalow.getNumberOfRooms());
        assertEquals(5, bungalow.getNumberOfBeds());
        assertEquals(100, bungalow.getUnitPrice());
    }
}
