package com.fishyfinds.isa.requirements;

import com.fishyfinds.isa.model.beans.AccountDeletionRequest;
import com.fishyfinds.isa.model.beans.Complaint;
import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.UserFeedback;
import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.offers.courses.Course;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.Admin;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import com.fishyfinds.isa.model.enums.ReservationStatus;
import com.fishyfinds.isa.model.enums.StatusOfReservation;
import com.fishyfinds.isa.repository.AccountDeletionRequestRepository;
import com.fishyfinds.isa.repository.ComplaintRepository;
import com.fishyfinds.isa.repository.FeedbackRepository;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.PenalRepository;
import com.fishyfinds.isa.repository.VisitReportRepository;
import com.fishyfinds.isa.repository.offers.BoatRepository;
import com.fishyfinds.isa.repository.offers.BungalowRepository;
import com.fishyfinds.isa.repository.offers.CourseRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.terms.CancelledReservationRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.terms.TermRepository;
import com.fishyfinds.isa.repository.users.AdminRepository;
import com.fishyfinds.isa.repository.users.BoatOwnerRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.repository.users.InstructorRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.AccountDeletionRequestService;
import com.fishyfinds.isa.service.AdminFinanceService;
import com.fishyfinds.isa.service.ComplaintService;
import com.fishyfinds.isa.service.FeedbackService;
import com.fishyfinds.isa.service.LoyaltyProgramService;
import com.fishyfinds.isa.service.MailService;
import com.fishyfinds.isa.service.OwnerAnalyticsService;
import com.fishyfinds.isa.service.PenalService;
import com.fishyfinds.isa.service.SubscriberService;
import com.fishyfinds.isa.service.VisitReportService;
import com.fishyfinds.isa.service.offers.BoatService;
import com.fishyfinds.isa.service.offers.BungalowService;
import com.fishyfinds.isa.service.offers.CourseService;
import com.fishyfinds.isa.service.terms.CancelledReservationService;
import com.fishyfinds.isa.service.terms.ReservationService;
import com.fishyfinds.isa.service.users.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * ISA requirements checklist suite (§3.1–3.29 + concurrency PDF).
 * Complements student1/2/3 packages with named coverage of acceptance criteria.
 */
@ExtendWith(MockitoExtension.class)
class RequirementsChecklistTest {

    @Nested
    @DisplayName("F01 — Guest public catalogs")
    class GuestCatalog {
        @Mock BungalowRepository bungalowRepository;
        @Mock BoatRepository boatRepository;
        @Mock CourseRepository courseRepository;
        @InjectMocks BungalowService bungalowService;
        @InjectMocks BoatService boatService;
        @InjectMocks CourseService courseService;

        @Test
        @DisplayName("Browse bungalows without login")
        void browseBungalows() {
            when(bungalowRepository.findAll()).thenReturn(Collections.singletonList(new Bungalow()));
            assertEquals(1, bungalowService.findAll().size());
        }

        @Test
        @DisplayName("Browse boats without login")
        void browseBoats() {
            when(boatRepository.findAll()).thenReturn(Collections.singletonList(new Boat()));
            assertEquals(1, boatService.findAll().size());
        }

        @Test
        @DisplayName("Browse courses without login")
        void browseCourses() {
            when(courseRepository.findAll()).thenReturn(Collections.singletonList(new Course()));
            assertEquals(1, courseService.findAll().size());
        }
    }

    @Nested
    @DisplayName("F12 / F17–F19 — Customer reservations / cancel / penals")
    class CustomerFlows {
        @Mock ReservationRepository reservationRepository;
        @Mock TermRepository termRepository;
        @Mock CustomerRepository customerRepository;
        @Mock OfferRepository offerRepository;
        @Mock MailService mailService;
        @Mock PenalService penalService;
        @Mock CancelledReservationRepository cancelledReservationRepositoty;
        @Mock CancelledReservationService cancelledReservationService;
        @Mock LoyaltyProgramRepository lRP;
        @InjectMocks ReservationService reservationService;

        @Test
        @DisplayName("Block booking when penalties >= 3")
        void blockWhenTooManyPenals() {
            Customer c = new Customer();
            c.setEmail("mail@mail.com");
            Penal p = new Penal();
            p.setNumber(3);
            when(customerRepository.findByEmail("mail@mail.com")).thenReturn(c);
            when(penalService.getPenalForUser("mail@mail.com")).thenReturn(p);

            Map<String, String> dto = new HashMap<>();
            dto.put("termId", "1");
            dto.put("offerId", "1");
            dto.put("numberOfPeople", "2");
            dto.put("duration", "2");
            dto.put("startDate", "2030-01-01T10:00:00");
            dto.put("additionalServices", "");

            assertFalse(reservationService.makeReservation(dto, "mail@mail.com"));
            verify(reservationRepository, never()).save(any());
        }

        @Test
        @DisplayName("Upcoming reservations for customer")
        void upcomingReservations() {
            when(reservationRepository.findAllUpcomingReservationsForUser(eq("mail@mail.com"), any()))
                    .thenReturn(Collections.singletonList(new Reservation()));
            assertEquals(1, reservationService.upcomingReservationsForCustomer("mail@mail.com").size());
        }

        @Test
        @DisplayName("Reservation history for customer")
        void historyReservations() {
            when(reservationRepository.findAllPassedReservationsForCustomer(eq("mail@mail.com"), any()))
                    .thenReturn(Collections.emptyList());
            assertNotNull(reservationService.historyOfReservationsForCustomer("mail@mail.com"));
        }

        @Test
        @DisplayName("Cancel missing reservation fails safely")
        void cancelMissing() {
            when(reservationRepository.findById(999L)).thenReturn(Optional.empty());
            assertFalse(reservationService.cancelReservation(999L));
        }

        @Test
        @DisplayName("F19 — cancel allowed when start is more than 3 days away")
        void cancelAllowedWithLeadTime() {
            Reservation reservation = new Reservation();
            reservation.setId(1L);
            reservation.setStartDate(LocalDateTime.now().plusDays(10));
            reservation.setReservationStatus(ReservationStatus.ACTIVE);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

            assertTrue(reservationService.cancelReservation(1L));
            assertEquals(ReservationStatus.CANCELLED, reservation.getReservationStatus());
            verify(cancelledReservationRepositoty).save(any());
        }

        @Test
        @DisplayName("F19 — cancel blocked within 3 days of start")
        void cancelBlockedTooLate() {
            Reservation reservation = new Reservation();
            reservation.setId(2L);
            reservation.setStartDate(LocalDateTime.now().plusDays(1));
            reservation.setReservationStatus(ReservationStatus.ACTIVE);
            when(reservationRepository.findById(2L)).thenReturn(Optional.of(reservation));

            assertFalse(reservationService.cancelReservation(2L));
            verify(reservationRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("F18 — Action booking race guards")
    class ActionBooking {
        @Mock ReservationRepository reservationRepository;
        @Mock TermRepository termRepository;
        @Mock CustomerRepository customerRepository;
        @Mock OfferRepository offerRepository;
        @Mock MailService mailService;
        @Mock PenalService penalService;
        @Mock CancelledReservationRepository cancelledReservationRepositoty;
        @Mock CancelledReservationService cancelledReservationService;
        @Mock LoyaltyProgramRepository lRP;
        @InjectMocks ReservationService reservationService;

        @Test
        @DisplayName("Cannot book when term is missing (optimistic race)")
        void missingTermFails() {
            Customer c = new Customer();
            c.setEmail("a@b.com");
            Penal p = new Penal();
            p.setNumber(0);
            when(customerRepository.findByEmail("a@b.com")).thenReturn(c);
            when(penalService.getPenalForUser("a@b.com")).thenReturn(p);
            when(termRepository.findById(1L)).thenReturn(Optional.empty());

            Map<String, String> dto = new HashMap<>();
            dto.put("termId", "1");
            dto.put("offerId", "1");
            dto.put("numberOfPeople", "1");
            dto.put("duration", "1");
            dto.put("startDate", "2030-06-01T10:00:00");
            dto.put("additionalServices", "");

            assertFalse(reservationService.makeReservation(dto, "a@b.com"));
        }

        @Test
        @DisplayName("Action booking fails for unknown action id")
        void missingActionFails() {
            Customer c = new Customer();
            c.setEmail("a@b.com");
            Penal p = new Penal();
            p.setNumber(0);
            when(customerRepository.findByEmail("a@b.com")).thenReturn(c);
            when(penalService.getPenalForUser("a@b.com")).thenReturn(p);
            when(reservationRepository.findById(42L)).thenReturn(Optional.empty());

            assertFalse(reservationService.makeReservationAction(42L, "a@b.com"));
        }
    }

    @Nested
    @DisplayName("F21 — Feedback moderation")
    class FeedbackModeration {
        @Mock FeedbackRepository feedbackRepository;
        @Mock ReservationRepository reservationRepository;
        @Mock MailService mailService;
        @InjectMocks FeedbackService feedbackService;

        @Test
        @DisplayName("Accept pending feedback")
        void acceptFeedback() {
            UserFeedback fb = new UserFeedback();
            fb.setStatus(ComplaintStatus.PENDING);
            when(feedbackRepository.findById(1)).thenReturn(Optional.of(fb));
            assertTrue(feedbackService.acceptFeedback(1L));
            assertEquals(ComplaintStatus.ACCEPTED, fb.getStatus());
        }

        @Test
        @DisplayName("Decline missing feedback returns false")
        void declineMissing() {
            when(feedbackRepository.findById(99)).thenReturn(Optional.empty());
            assertFalse(feedbackService.declineFeedback(99L));
        }
    }

    @Nested
    @DisplayName("F24 — Subscriptions")
    class Subscriptions {
        @Mock CustomerRepository customerRepository;
        @Mock UserRepository userRepository;
        @Mock OfferRepository offerRepository;
        @Mock com.fishyfinds.isa.repository.SubscriberRepository subscriberRepository;
        @InjectMocks SubscriberService subscriberService;

        @Test
        @DisplayName("List relevant subscriptions for customer")
        void listSubscriptions() {
            Customer c = new Customer();
            when(userRepository.findByEmail("mail@mail.com")).thenReturn(c);
            when(subscriberRepository.findAllByFollower(c)).thenReturn(Collections.emptyList());
            assertTrue(subscriberService.getSubscriptionsByUser("mail@mail.com").isEmpty());
        }
    }

    @Nested
    @DisplayName("F26 — Complaints")
    class Complaints {
        @Mock ReservationRepository reservationRepository;
        @Mock UserRepository userRepository;
        @Mock ComplaintRepository complaintRepository;
        @InjectMocks ComplaintService complaintService;

        @Test
        @DisplayName("List pending complaints")
        void pendingComplaints() {
            Complaint pending = new Complaint();
            pending.setStatus(ComplaintStatus.PENDING);
            Complaint done = new Complaint();
            done.setStatus(ComplaintStatus.ACCEPTED);
            when(complaintRepository.findAll()).thenReturn(Arrays.asList(pending, done));
            assertEquals(1, complaintService.findAllPending().size());
        }
    }

    @Nested
    @DisplayName("F27 — Account deletion requests")
    class DeletionRequests {
        @Mock AccountDeletionRequestRepository accountDeletionRequestRepository;
        @Mock UserRepository userRepository;
        @Mock UserService userService;
        @Mock MailService mailService;
        @InjectMocks AccountDeletionRequestService accountDeletionRequestService;

        @Test
        @DisplayName("List pending deletion requests")
        void pendingDeletions() {
            AccountDeletionRequest req = new AccountDeletionRequest();
            req.setStatus(com.fishyfinds.isa.model.enums.DeletionRequestStatus.PENDING);
            when(accountDeletionRequestRepository.findAll()).thenReturn(Collections.singletonList(req));
            assertEquals(1, accountDeletionRequestService.findAllPending().size());
        }
    }

    @Nested
    @DisplayName("F23 — Visit reports")
    class VisitReports {
        @Mock VisitReportRepository visitReportRepository;
        @Mock ReservationRepository reservationRepository;
        @Mock UserRepository userRepository;
        @Mock PenalRepository penalRepository;
        @Mock PenalService penalService;
        @InjectMocks VisitReportService visitReportService;

        @Test
        @DisplayName("Reject visit report without reservation id")
        void rejectIncomplete() {
            when(userRepository.findByEmail("owner@mail.com")).thenReturn(new com.fishyfinds.isa.model.beans.users.User());
            Map<String, Object> msg = new HashMap<>();
            msg.put("comment", "ok");
            assertFalse(visitReportService.submitVisitReport("owner@mail.com", msg));
        }
    }

    @Nested
    @DisplayName("F29 — Loyalty program")
    class Loyalty {
        @Mock LoyaltyProgramRepository loyaltyProgramRepository;
        @Mock CustomerRepository customerRepository;
        @Mock BoatOwnerRepository boatOwnerRepostory;
        @Mock InstructorRepository instructorRepository;
        @InjectMocks LoyaltyProgramService loyaltyProgramService;

        @Test
        @DisplayName("Admin can list loyalty categories")
        void listCategories() {
            when(loyaltyProgramRepository.findAll()).thenReturn(Collections.singletonList(new LoyaltyProgram()));
            assertEquals(1, loyaltyProgramService.getAllLoyalties().size());
        }

        @Test
        @DisplayName("Duplicate loyalty category name is not saved")
        void rejectDuplicate() {
            LoyaltyProgram existing = new LoyaltyProgram();
            existing.setCategoryName("Shark");
            when(loyaltyProgramRepository.findAll()).thenReturn(Collections.singletonList(existing));
            Map<String, String> msg = new HashMap<>();
            msg.put("categoryName", "Shark");
            msg.put("categoryDiscount", "10");
            msg.put("earningRate", "1");
            msg.put("requiredPoints", "100");
            loyaltyProgramService.addNewLoyalty(msg);
            verify(loyaltyProgramRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("F11 — Admin income / system cut")
    class AdminIncome {
        @Mock AdminRepository adminRepository;
        @Mock ReservationRepository reservationRepository;
        @InjectMocks AdminFinanceService adminFinanceService;

        @Test
        @DisplayName("Compute admin income from reservations and cut %")
        void incomeReport() {
            Admin admin = new Admin();
            admin.setEarningPercentage(10.0);
            when(adminRepository.findAll()).thenReturn(Collections.singletonList(admin));
            Reservation r = new Reservation();
            r.setTotalPrice(100.0);
            when(reservationRepository.findAll()).thenReturn(Collections.singletonList(r));

            Map<String, Object> result = adminFinanceService.getAdminIncome();
            assertEquals(10.0, (Double) result.get("adminIncome"), 0.001);
        }
    }

    @Nested
    @DisplayName("F06 / F08 / F10 — Owner analytics")
    class OwnerAnalytics {
        @Mock ReservationRepository reservationRepository;
        @Mock OfferRepository offerRepository;
        @Mock UserRepository userRepository;
        @InjectMocks OwnerAnalyticsService ownerAnalyticsService;

        @Test
        @DisplayName("Owner reports map is returned")
        void reports() {
            com.fishyfinds.isa.model.beans.users.User owner = new com.fishyfinds.isa.model.beans.users.User();
            when(userRepository.findByEmail("zokaMagic@mail.com")).thenReturn(owner);
            when(reservationRepository.findAll()).thenReturn(Collections.emptyList());
            when(offerRepository.findAllByUser(owner)).thenReturn(Collections.emptyList());
            Map<String, Object> report = ownerAnalyticsService.getReportsForOwner("zokaMagic@mail.com");
            assertNotNull(report);
            assertTrue(report.containsKey("averageRating"));
            assertTrue(report.containsKey("totalIncome"));
        }
    }

    @Nested
    @DisplayName("Domain model")
    class DomainModel {
        @Test
        @DisplayName("Reservation status model includes ACTIVE and CANCELLED")
        void reservationStatusesExist() {
            assertTrue(Arrays.asList(ReservationStatus.values()).contains(ReservationStatus.ACTIVE));
            assertTrue(Arrays.asList(ReservationStatus.values()).contains(ReservationStatus.CANCELLED));
            assertTrue(StatusOfReservation.values().length >= 2);
        }
    }
}
