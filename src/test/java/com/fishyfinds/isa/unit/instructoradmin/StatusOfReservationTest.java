package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.enums.StatusOfReservation;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StatusOfReservationTest {

    @Test
    void activeAndCancelledOnly() {
        assertEquals(2, StatusOfReservation.values().length);
        assertEquals(StatusOfReservation.ACTIVE, StatusOfReservation.valueOf("ACTIVE"));
        assertEquals(StatusOfReservation.CANCELLED, StatusOfReservation.valueOf("CANCELLED"));
    }
}
