package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.enums.ReservationStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ReservationStatusTest {

    @Test
    void activeCancelledAndFailed() {
        assertEquals(3, ReservationStatus.values().length);
        assertEquals(ReservationStatus.ACTIVE, ReservationStatus.valueOf("ACTIVE"));
        assertEquals(ReservationStatus.CANCELLED, ReservationStatus.valueOf("CANCELLED"));
        assertEquals(ReservationStatus.FAILED, ReservationStatus.valueOf("FAILED"));
    }
}
