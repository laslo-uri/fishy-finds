package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.ReservationType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ReservationTypeEnumTest {

    @Test
    void containsDefaultAndQuick() {
        assertEquals(2, ReservationType.values().length);
        assertEquals(ReservationType.DEFAULT, ReservationType.valueOf("DEFAULT"));
        assertEquals(ReservationType.QUICK, ReservationType.valueOf("QUICK"));
    }
}
