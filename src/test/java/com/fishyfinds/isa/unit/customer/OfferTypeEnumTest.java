package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.OfferType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OfferTypeEnumTest {

    @Test
    void allOfferTypesPresent() {
        assertArrayEquals(
                new OfferType[]{OfferType.BUNGALOW, OfferType.BOAT, OfferType.COURSE, OfferType.INVALID},
                OfferType.values()
        );
    }

    @Test
    void invalidIsDistinctFromRealOffers() {
        assertNotEquals(OfferType.BUNGALOW, OfferType.INVALID);
        assertNotEquals(OfferType.BOAT, OfferType.INVALID);
        assertNotEquals(OfferType.COURSE, OfferType.INVALID);
    }
}
