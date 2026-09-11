package com.fishyfinds.isa.integration.customer;

import com.fishyfinds.isa.model.beans.UserFeedback;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import com.fishyfinds.isa.repository.FeedbackRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.service.FeedbackService;
import com.fishyfinds.isa.service.MailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceAcceptTest {

    @Mock FeedbackRepository feedbackRepository;
    @Mock ReservationRepository reservationRepository;
    @Mock MailService mailService;
    @InjectMocks FeedbackService feedbackService;

    @Test
    void acceptFeedbackReturnsFalseWhenMissing() {
        when(feedbackRepository.findById(7)).thenReturn(Optional.empty());
        assertFalse(feedbackService.acceptFeedback(7L));
    }

    @Test
    void acceptFeedbackSetsAcceptedStatus() {
        UserFeedback feedback = new UserFeedback();
        feedback.setStatus(ComplaintStatus.PENDING);
        when(feedbackRepository.findById(3)).thenReturn(Optional.of(feedback));

        assertTrue(feedbackService.acceptFeedback(3L));
        assertEquals(ComplaintStatus.ACCEPTED, feedback.getStatus());
        verify(feedbackRepository).save(feedback);
    }
}
