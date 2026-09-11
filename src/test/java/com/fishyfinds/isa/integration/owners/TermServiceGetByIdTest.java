package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.terms.Term;
import com.fishyfinds.isa.repository.terms.TermRepository;
import com.fishyfinds.isa.service.terms.TermService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TermServiceGetByIdTest {

    @Mock TermRepository termRepository;
    @InjectMocks TermService termService;

    @Test
    void getTermByIdReturnsEntity() {
        Term term = new Term();
        term.setId(3L);
        when(termRepository.findById(3L)).thenReturn(Optional.of(term));
        assertEquals(3L, termService.getTermById(3L).getId());
    }

    @Test
    void getTermByIdReturnsNullWhenAbsent() {
        when(termRepository.findById(1L)).thenReturn(Optional.empty());
        assertNull(termService.getTermById(1L));
    }
}
