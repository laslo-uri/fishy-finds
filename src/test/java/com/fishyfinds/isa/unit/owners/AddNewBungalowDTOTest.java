package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.dto.AddNewBungalowDTO;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class AddNewBungalowDTOTest {

    @Test
    void constructorAndGetters() {
        AddNewBungalowDTO dto = new AddNewBungalowDTO(
                "Sea Cabin", "Serbia", "Novi Sad", "Beach", "12",
                19.8, 45.2, "Nice bungalow", 80.0, 4, 2, 3,
                "No pets", "Free cancel", new ArrayList<>(), new ArrayList<>()
        );
        assertEquals("Sea Cabin", dto.getOfferName());
        assertEquals("Novi Sad", dto.getCity());
        assertEquals(2, dto.getNumberOfRooms());
        assertEquals(3, dto.getNumberOfBeds());
        assertEquals(80.0, dto.getUnitPrice());
    }

    @Test
    void settersUpdateFields() {
        AddNewBungalowDTO dto = new AddNewBungalowDTO();
        dto.setOfferName("Lake House");
        dto.setMaxCustomerCapacity(6);
        assertEquals("Lake House", dto.getOfferName());
        assertEquals(6, dto.getMaxCustomerCapacity());
        assertTrue(dto.toString().contains("Lake House"));
    }
}
