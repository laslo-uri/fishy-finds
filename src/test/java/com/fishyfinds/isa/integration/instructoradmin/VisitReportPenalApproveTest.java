package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.VisitReport;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import com.fishyfinds.isa.repository.PenalRepository;
import com.fishyfinds.isa.repository.VisitReportRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.MailService;
import com.fishyfinds.isa.service.PenalService;
import com.fishyfinds.isa.service.VisitReportService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VisitReportPenalApproveTest {

    @Mock VisitReportRepository visitReportRepository;
    @Mock ReservationRepository reservationRepository;
    @Mock UserRepository userRepository;
    @Mock PenalRepository penalRepository;
    @Mock PenalService penalService;
    @Mock MailService mailService;
    @InjectMocks VisitReportService visitReportService;

    @Test
    void approvePenalRequestAppliesPenaltyWhenRequestedAndNotNoShow() {
        Customer customer = new Customer();
        customer.setEmail("mail@mail.com");
        customer.setFirstName("Ana");
        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);

        User submitter = new User();
        submitter.setEmail("zokaMagic@mail.com");
        submitter.setFirstName("Zoka");

        VisitReport report = new VisitReport();
        report.setStatus(ComplaintStatus.PENDING);
        report.setRequestPenal(true);
        report.setNoShow(false);
        report.setReservation(reservation);
        report.setSubmittedBy(submitter);
        report.setComment("late");

        Penal penal = new Penal();
        penal.setNumber(1);
        when(visitReportRepository.findById(11L)).thenReturn(Optional.of(report));
        when(penalRepository.findByCustomer(customer)).thenReturn(penal);

        assertTrue(visitReportService.approvePenalRequest(11L));
        assertEquals(ComplaintStatus.ACCEPTED, report.getStatus());
        assertEquals(2, penal.getNumber());
        verify(penalRepository).save(penal);
        verify(visitReportRepository).save(report);
    }

    @Test
    void declinePenalRequestMarksDeclinedWithoutChangingPenal() {
        VisitReport report = new VisitReport();
        report.setStatus(ComplaintStatus.PENDING);
        report.setRequestPenal(true);
        when(visitReportRepository.findById(12L)).thenReturn(Optional.of(report));

        assertTrue(visitReportService.declinePenalRequest(12L));
        assertEquals(ComplaintStatus.DECLINED, report.getStatus());
        verify(penalRepository, never()).save(any());
    }

    @Test
    void approvePenalRequestFailsWhenNotPending() {
        VisitReport report = new VisitReport();
        report.setStatus(ComplaintStatus.ACCEPTED);
        when(visitReportRepository.findById(13L)).thenReturn(Optional.of(report));

        assertFalse(visitReportService.approvePenalRequest(13L));
        verify(visitReportRepository, never()).save(any());
    }
}
