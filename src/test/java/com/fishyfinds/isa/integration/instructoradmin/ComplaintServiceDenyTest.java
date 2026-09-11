package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.Complaint;
import com.fishyfinds.isa.model.beans.ResolveComplaintRequest;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceDenyTest {

    @Mock ReservationRepository reservationRepository;
    @Mock UserRepository userRepository;
    @Mock ComplaintRepository complaintRepository;
    @InjectMocks ComplaintService complaintService;

    @Test
    void denyComplaintSetsDeclined() {
        Complaint complaint = new Complaint();
        complaint.setStatus(ComplaintStatus.PENDING);
        when(complaintRepository.findById(2)).thenReturn(Optional.of(complaint));

        ResolveComplaintRequest request = new ResolveComplaintRequest();
        request.setComplaintId(2L);

        assertTrue(complaintService.denyComplaint(request));
        assertEquals(ComplaintStatus.DECLINED, complaint.getStatus());
    }
}
