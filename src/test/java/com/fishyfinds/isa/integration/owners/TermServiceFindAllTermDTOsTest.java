package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.dto.TermDTO;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.terms.Term;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.repository.terms.TermRepository;
import com.fishyfinds.isa.service.terms.TermService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TermServiceFindAllTermDTOsTest {

    @Mock TermRepository termRepository;
    @InjectMocks TermService termService;

    @Test
    void mapsTermsToDtos() {
        Boat boat = new Boat();
        boat.setOfferType(OfferType.BOAT);
        boat.setOfferName("X");
        Term term = new Term();
        term.setId(1L);
        term.setOffer(boat);
        term.setStartDate(LocalDateTime.of(2026, 8, 1, 0, 0));
        term.setEndDate(LocalDateTime.of(2026, 8, 10, 0, 0));
        when(termRepository.findAll()).thenReturn(new java.util.ArrayList<>(java.util.Collections.singletonList(term)));

        List<TermDTO> dtos = termService.findAllTermDTOs();
        assertEquals(1, dtos.size());
        assertEquals(1L, dtos.get(0).getId());
        assertEquals("X", dtos.get(0).getOffer().getOfferName());
    }
}
