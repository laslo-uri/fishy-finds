package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.VisitReport;
import com.fishyfinds.isa.repository.PenalRepository;
import com.fishyfinds.isa.repository.VisitReportRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.PenalService;
import com.fishyfinds.isa.service.VisitReportService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VisitReportServiceSubmitTest {

    @Mock VisitReportRepository visitReportRepository;
    @Mock ReservationRepository reservationRepository;
    @Mock UserRepository userRepository;
    @Mock PenalRepository penalRepository;
    @Mock PenalService penalService;
    @InjectMocks VisitReportService visitReportService;

    @Test
    void submitVisitReportFailsWhenUserMissing() {
        when(userRepository.findByEmail("ghost@x.com")).thenReturn(null);
        Map<String, Object> message = new HashMap<>();
        message.put("reservationId", 1L);
        assertFalse(visitReportService.submitVisitReport("ghost@x.com", message));
        verify(visitReportRepository, never()).save(any(VisitReport.class));
    }
}
