package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.ComplaintStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ComplaintStatusEnumTest {

    @Test
    void valuesContainExpectedStatuses() {
        ComplaintStatus[] values = ComplaintStatus.values();
        assertEquals(3, values.length);
        assertEquals(ComplaintStatus.PENDING, ComplaintStatus.valueOf("PENDING"));
        assertEquals(ComplaintStatus.ACCEPTED, ComplaintStatus.valueOf("ACCEPTED"));
        assertEquals(ComplaintStatus.DECLINED, ComplaintStatus.valueOf("DECLINED"));
    }

    @Test
    void valueOfIsCaseSensitive() {
        assertThrows(IllegalArgumentException.class, () -> ComplaintStatus.valueOf("pending"));
    }
}
