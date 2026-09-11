package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.dto.AddNewBoatDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AddNewBoatDTOTest {

    @Test
    void boatSpecificFields() {
        AddNewBoatDTO dto = new AddNewBoatDTO();
        dto.setOfferName("Speedy");
        dto.setBoatType("Yacht");
        dto.setBoatLength(12.5);
        dto.setNumberOfEngines(2);
        dto.setPower(200);
        dto.setMaxSpeed(45);

        assertEquals("Speedy", dto.getOfferName());
        assertEquals("Yacht", dto.getBoatType());
        assertEquals(12.5, dto.getBoatLength());
        assertEquals(2, dto.getNumberOfEngines());
        assertEquals(200, dto.getPower());
        assertEquals(45, dto.getMaxSpeed());
    }
}
