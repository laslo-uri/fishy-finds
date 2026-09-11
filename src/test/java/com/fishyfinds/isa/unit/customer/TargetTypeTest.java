package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.TargetType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TargetTypeTest {

    @Test
    void includesOfferAndUserTargets() {
        assertEquals(6, TargetType.values().length);
        assertEquals(TargetType.BUNGALOW, TargetType.valueOf("BUNGALOW"));
        assertEquals(TargetType.BOAT, TargetType.valueOf("BOAT"));
        assertEquals(TargetType.COURSE, TargetType.valueOf("COURSE"));
        assertEquals(TargetType.OWNER, TargetType.valueOf("OWNER"));
        assertEquals(TargetType.INSTRUCTOR, TargetType.valueOf("INSTRUCTOR"));
        assertEquals(TargetType.CUSTOMER, TargetType.valueOf("CUSTOMER"));
    }
}
