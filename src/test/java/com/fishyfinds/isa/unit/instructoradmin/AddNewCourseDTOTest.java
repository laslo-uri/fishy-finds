package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.dto.AddNewCourseDTO;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class AddNewCourseDTOTest {

    @Test
    void courseDtoSetters() {
        AddNewCourseDTO dto = new AddNewCourseDTO();
        dto.setOfferName("Casting Basics");
        dto.setCountry("Serbia");
        dto.setCity("Zlatibor");
        dto.setStreet("Lake Rd");
        dto.setStreetNumber("3");
        dto.setDescription("Half-day casting");
        dto.setUnitPrice(40);
        dto.setMaxCustomerCapacity(6);
        dto.setRulesOfConduct("Listen to instructor");
        dto.setCancellationPolicy("24h");
        dto.setAdditionalServices(new ArrayList<>());
        dto.setImage(new ArrayList<>());

        assertEquals("Casting Basics", dto.getOfferName());
        assertEquals("Zlatibor", dto.getCity());
        assertEquals(40, dto.getUnitPrice());
        assertEquals(6, dto.getMaxCustomerCapacity());
        assertNotNull(dto.getAdditionalServices());
        assertNotNull(dto.getImage());
    }
}
