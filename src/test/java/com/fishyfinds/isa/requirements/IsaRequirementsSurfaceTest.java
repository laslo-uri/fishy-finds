package com.fishyfinds.isa.requirements;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ISA §3.1–3.29 surface checklist: required REST controllers / service APIs exist.
 * Complements behavioral tests in {@link RequirementsChecklistTest} and student1/2/3 packages.
 */
class IsaRequirementsSurfaceTest {

    private static Set<String> methods(Class<?> type) {
        return Arrays.stream(type.getDeclaredMethods())
                .map(Method::getName)
                .collect(Collectors.toSet());
    }

    private static void assertHas(Class<?> type, String... names) {
        Set<String> m = methods(type);
        for (String name : names) {
            assertTrue(m.contains(name), type.getSimpleName() + " missing method: " + name);
        }
    }

    @Nested
    @DisplayName("F01 / F02 / F04 — guest browse + register + profile")
    class GuestCustomerBasics {
        @Test
        void catalogControllers() {
            assertHas(com.fishyfinds.isa.controllers.offers.BungalowController.class, "findAll");
            assertHas(com.fishyfinds.isa.controllers.offers.BoatController.class, "findAll");
            assertHas(com.fishyfinds.isa.controllers.offers.CourseController.class, "findAll");
        }

        @Test
        void registrationAndProfile() {
            assertHas(com.fishyfinds.isa.controllers.RegistrationController.class,
                    "registerUser", "verifyUser");
            assertHas(com.fishyfinds.isa.controllers.users.UserController.class,
                    "changePassword", "changeProfile", "findUser");
        }
    }

    @Nested
    @DisplayName("F12 / F17–F20 — customer reservations")
    class CustomerReservations {
        @Test
        void reservationApis() {
            assertHas(com.fishyfinds.isa.controllers.terms.ReservationController.class,
                    "makeReservation", "makeReservationAction", "cancelReservation",
                    "historyOfReservationsForCustomer", "upcomingReservationsForCustomer",
                    "getActionsForOffer");
        }

        @Test
        void searchAndTerms() {
            assertHas(com.fishyfinds.isa.controllers.offers.OfferController.class, "searchBungalows");
            assertHas(com.fishyfinds.isa.controllers.terms.TermController.class,
                    "filterAvailableTerms", "getTermsByOfferId");
        }
    }

    @Nested
    @DisplayName("F21 / F24 / F26 / F27 — feedback, follow, complaints, deletion")
    class CustomerModeration {
        @Test
        void feedbackFollowComplaintDeletion() {
            assertHas(com.fishyfinds.isa.controllers.FeedbackController.class,
                    "addFeedback", "acceptFeedback", "declineFeedback");
            assertHas(com.fishyfinds.isa.controllers.SubscriberController.class,
                    "addSubscriber", "getSubscriptionsByUser");
            assertHas(com.fishyfinds.isa.controllers.ComplaintController.class,
                    "addComplaint", "acceptComplaint", "denyComplaint");
            assertHas(com.fishyfinds.isa.controllers.AccountDeletionRequestController.class,
                    "add", "approveDeleteRequest", "denyDeleteRequest");
            assertHas(com.fishyfinds.isa.controllers.PenalController.class, "getPenalForUser");
        }
    }

    @Nested
    @DisplayName("F05–F10 / F13–F16 — owner & instructor offers")
    class OwnerInstructorOffers {
        @Test
        void offerCrudApis() {
            assertHas(com.fishyfinds.isa.controllers.offers.BungalowController.class,
                    "findAllByOwnerId", "addNewBungalow");
            assertHas(com.fishyfinds.isa.controllers.offers.BoatController.class,
                    "findAllByOwnerId", "addNewBoat");
            assertHas(com.fishyfinds.isa.controllers.offers.CourseController.class,
                    "findAllByOwnerId", "addNewCourse");
            assertHas(com.fishyfinds.isa.controllers.terms.TermController.class,
                    "addNewTermToOffer");
        }
    }

    @Nested
    @DisplayName("F11 / F25 / F28 / F29 — admin + calendar + loyalty + income")
    class AdminLoyaltyFinance {
        @Test
        void adminSurfaces() {
            assertHas(com.fishyfinds.isa.controllers.LoyaltyProgramController.class,
                    "addNewLoyalty", "deleteLoyalty", "getAllLoyalties");
            assertHas(com.fishyfinds.isa.controllers.AdminFinanceController.class,
                    "getAdminIncome", "setSystemCut", "getSystemCut");
            assertHas(com.fishyfinds.isa.controllers.OwnerAnalyticsController.class,
                    "getOwnerReservations", "getOwnerReports", "submitVisitReport");
            assertHas(com.fishyfinds.isa.controllers.AccountDeletionRequestController.class,
                    "getAllCreationPendingRequests");
        }
    }

    @Nested
    @DisplayName("F22 / F23 — visit reports")
    class VisitReports {
        @Test
        void visitReportService() {
            assertHas(com.fishyfinds.isa.service.VisitReportService.class, "submitVisitReport");
        }
    }
}
