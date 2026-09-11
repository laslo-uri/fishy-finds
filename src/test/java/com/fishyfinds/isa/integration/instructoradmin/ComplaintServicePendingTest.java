package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.Complaint;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import com.fishyfinds.isa.repository.ComplaintRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.ComplaintService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ComplaintServicePendingTest {

    @Mock ReservationRepository reservationRepository;
    @Mock UserRepository userRepository;
    @Mock ComplaintRepository complaintRepository;
    @InjectMocks ComplaintService complaintService;

    @Test
    void findAllPendingFiltersStatus() {
        Complaint pending = new Complaint();
        pending.setStatus(ComplaintStatus.PENDING);
        Complaint accepted = new Complaint();
        accepted.setStatus(ComplaintStatus.ACCEPTED);
        when(complaintRepository.findAll()).thenReturn(Arrays.asList(pending, accepted));

        List<Complaint> result = complaintService.findAllPending();
        assertEquals(1, result.size());
        assertEquals(ComplaintStatus.PENDING, result.get(0).getStatus());
    }
}
