package com.fishyfinds.isa.requirements;

import com.fishyfinds.isa.config.SpaForwardController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Clean history-mode routes must forward to the Vue index (no /#/).
 */
class SpaRoutingTest {

    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new SpaForwardController()).build();

    @ParameterizedTest(name = "GET {0} → index.html")
    @ValueSource(strings = {
            "/",
            "/bungalows",
            "/boats",
            "/instructors",
            "/courses",
            "/sign-in",
            "/signIn",
            "/register",
            "/account",
            "/my-bungalows",
            "/my-boats",
            "/my-courses",
            "/new-course",
            "/newCourse",
            "/owner-calendar",
            "/owner-reports",
            "/visit-report",
            "/bungalow-reservation-history",
            "/bungalowReservationHistory",
            "/boat-reservation-history",
            "/course-reservation-history",
            "/following",
            "/penalties",
            "/penals",
            "/make-reservation",
            "/makeReservation",
            "/upcoming-reservations",
            "/upcomingReservations",
            "/actions/12",
            "/reservation-form/5",
            "/reservationForm/5",
            "/complaints",
            "/admin",
            "/admin-reg-req-complaints",
            "/admin/registrations",
            "/admin/complaints",
            "/admin/reviews",
            "/admin/deletion-requests",
            "/admin/penalties",
            "/admin/directory",
            "/admin-register",
            "/admin-user-complaints",
            "/admin-loyalty",
            "/admin-income"
    })
    @DisplayName("SPA history routes forward to index.html")
    void spaForwards(String path) throws Exception {
        mockMvc.perform(get(path))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }
}
