package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.dto.TermDTO;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class TermDTOTest {

    @Test
    void termDtoFields() {
        Boat boat = new Boat();
        boat.setOfferName("Blue Boat");
        TermDTO dto = new TermDTO();
        dto.setId(10L);
        dto.setOffer(boat);
        dto.setStartTime(LocalDateTime.of(2026, 6, 1, 10, 0));
        dto.setEndTime(LocalDateTime.of(2026, 6, 10, 10, 0));
        dto.setReservations(new ArrayList<>());
        dto.setPath("images/boat.jpg");

        assertEquals(10L, dto.getId());
        assertEquals("Blue Boat", dto.getOffer().getOfferName());
        assertEquals(2026, dto.getStartTime().getYear());
        assertTrue(dto.getReservations().isEmpty());
        assertEquals("images/boat.jpg", dto.getPath());
    }
}
