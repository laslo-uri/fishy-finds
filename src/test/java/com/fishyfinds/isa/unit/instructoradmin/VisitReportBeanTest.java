package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.beans.VisitReport;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.Admin;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class VisitReportBeanTest {

    @Test
    void visitReportFlags() {
        VisitReport report = new VisitReport();
        Reservation reservation = new Reservation();
        reservation.setId(3L);
        Admin submitter = new Admin();
        submitter.setEmail("owner@example.com");

        report.setId(1L);
        report.setReservation(reservation);
        report.setComment("Customer did not arrive");
        report.setRequestPenal(true);
        report.setNoShow(true);
        report.setStatus(ComplaintStatus.PENDING);
        report.setSubmittedBy(submitter);

        assertTrue(report.isNoShow());
        assertTrue(report.isRequestPenal());
        assertEquals(ComplaintStatus.PENDING, report.getStatus());
        assertEquals(3L, report.getReservation().getId());
        assertEquals("owner@example.com", report.getSubmittedBy().getEmail());
    }
}
