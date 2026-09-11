package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.AdditionalServiceType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdditionalServiceTypeTest {

    @Test
    void containsServiceAndToolTypes() {
        assertEquals(3, AdditionalServiceType.values().length);
        assertEquals(AdditionalServiceType.ADDITIONAL_SERVICE, AdditionalServiceType.valueOf("ADDITIONAL_SERVICE"));
        assertEquals(AdditionalServiceType.FISHING_TOOL, AdditionalServiceType.valueOf("FISHING_TOOL"));
        assertEquals(AdditionalServiceType.NAVIGATIONAL_TOOL, AdditionalServiceType.valueOf("NAVIGATIONAL_TOOL"));
    }
}
