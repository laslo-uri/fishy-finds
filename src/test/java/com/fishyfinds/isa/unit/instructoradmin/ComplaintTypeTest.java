package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.enums.ComplaintType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ComplaintTypeTest {

    @Test
    void allComplaintTypes() {
        assertEquals(3, ComplaintType.values().length);
        assertEquals(ComplaintType.OFFER_COMPLAINT, ComplaintType.valueOf("OFFER_COMPLAINT"));
        assertEquals(ComplaintType.OWNER_COMPLAINT, ComplaintType.valueOf("OWNER_COMPLAINT"));
        assertEquals(ComplaintType.BOTH_COMPLAINT, ComplaintType.valueOf("BOTH_COMPLAINT"));
    }
}
