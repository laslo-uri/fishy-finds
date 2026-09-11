package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.beans.UserFeedback;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserFeedbackBeanTest {

    @Test
    void feedbackFieldsAndStatus() {
        Reservation reservation = new Reservation();
        reservation.setId(9L);
        UserFeedback feedback = new UserFeedback();
        feedback.setId(1);
        feedback.setContentForOwner("Great host");
        feedback.setContentForOffer("Clean place");
        feedback.setRateOwner(5);
        feedback.setRateOffer(4);
        feedback.setStatus(ComplaintStatus.PENDING);
        feedback.setReservation(reservation);

        assertEquals(1, feedback.getId());
        assertEquals(5, feedback.getRateOwner());
        assertEquals(4, feedback.getRateOffer());
        assertEquals(ComplaintStatus.PENDING, feedback.getStatus());
        assertEquals(9L, feedback.getReservation().getId());
    }
}
