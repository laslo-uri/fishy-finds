package com.fishyfinds.isa.service;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VisitReportService {

    @Autowired
    private VisitReportRepository visitReportRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PenalRepository penalRepository;
    @Autowired
    private PenalService penalService;
    @Autowired
    private MailService mailService;

    public boolean submitVisitReport(String username, Map<String, Object> message) {
        User submitter = userRepository.findByEmail(username);
        if (submitter == null) {
            return false;
        }

        Object reservationIdObj = message.get("reservationId");
        if (reservationIdObj == null) {
            reservationIdObj = message.get("id");
        }
        if (reservationIdObj == null) {
            return false;
        }

        Long reservationId = Long.parseLong(reservationIdObj.toString());
        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation == null) {
            return false;
        }

        boolean noShow = toBoolean(message.get("noShow"));
        boolean requestPenal = toBoolean(message.get("requestPenal"));
        Object commentObj = message.get("comment");
        String comment = commentObj != null ? commentObj.toString() : "";

        VisitReport report = new VisitReport();
        report.setReservation(reservation);
        report.setComment(comment);
        report.setNoShow(noShow);
        report.setRequestPenal(requestPenal);
        report.setSubmittedBy(submitter);
        report.setStatus(requestPenal ? ComplaintStatus.PENDING : ComplaintStatus.ACCEPTED);

        if (noShow && reservation.getCustomer() != null) {
            addOnePenal(reservation.getCustomer());
        }

        visitReportRepository.save(report);
        return true;
    }

    public List<VisitReport> findAllPendingPenalRequests() {
        return visitReportRepository.findAll().stream()
                .filter(r -> r.isRequestPenal() && r.getStatus() == ComplaintStatus.PENDING)
                .collect(Collectors.toList());
    }

    public boolean approvePenalRequest(Long reportId) {
        VisitReport report = visitReportRepository.findById(reportId).orElse(null);
        if (report == null || report.getStatus() != ComplaintStatus.PENDING) {
            return false;
        }
        Reservation reservation = report.getReservation();
        // No-show already applied +1 on submit. Requested penals without no-show wait for admin.
        if (reservation != null && reservation.getCustomer() != null && report.isRequestPenal() && !report.isNoShow()) {
            addOnePenal(reservation.getCustomer());
        }
        report.setStatus(ComplaintStatus.ACCEPTED);
        visitReportRepository.save(report);
        notifyPenalDecision(report, true);
        return true;
    }

    public boolean declinePenalRequest(Long reportId) {
        VisitReport report = visitReportRepository.findById(reportId).orElse(null);
        if (report == null || report.getStatus() != ComplaintStatus.PENDING) {
            return false;
        }
        report.setStatus(ComplaintStatus.DECLINED);
        visitReportRepository.save(report);
        notifyPenalDecision(report, false);
        return true;
    }

    private void notifyPenalDecision(VisitReport report, boolean approved) {
        try {
            Reservation reservation = report.getReservation();
            if (reservation == null) {
                return;
            }
            if (reservation.getCustomer() != null) {
                mailService.sendPenalDecisionEmail(
                        reservation.getCustomer().getEmail(),
                        reservation.getCustomer().getFirstName(),
                        approved,
                        report.getComment());
            }
            if (report.getSubmittedBy() != null) {
                mailService.sendPenalDecisionEmail(
                        report.getSubmittedBy().getEmail(),
                        report.getSubmittedBy().getFirstName(),
                        approved,
                        report.getComment());
            }
        } catch (Exception ignored) {
        }
    }

    private void addOnePenal(Customer customer) {
        Penal penal = penalRepository.findByCustomer(customer);
        if (penal == null) {
            penalService.addNewPenal(customer);
            penal = penalRepository.findByCustomer(customer);
        }
        if (penal != null) {
            penal.setNumber(penal.getNumber() + 1);
            penalRepository.save(penal);
        }
    }

    private boolean toBoolean(Object value) {
        if (value == null) {
            return false;
        }
        if (value instanceof Boolean) {
            return (Boolean) value;
        }
        return Boolean.parseBoolean(value.toString());
    }
}
