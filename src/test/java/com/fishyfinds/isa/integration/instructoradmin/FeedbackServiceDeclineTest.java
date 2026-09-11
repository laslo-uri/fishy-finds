package com.fishyfinds.isa.integration.instructoradmin;

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
class FeedbackServiceDeclineTest {

    @Mock FeedbackRepository feedbackRepository;
    @Mock ReservationRepository reservationRepository;
    @Mock MailService mailService;
    @InjectMocks FeedbackService feedbackService;

    @Test
    void declineFeedbackSetsDeclined() {
        UserFeedback feedback = new UserFeedback();
        feedback.setStatus(ComplaintStatus.PENDING);
        when(feedbackRepository.findById(5)).thenReturn(Optional.of(feedback));

        assertTrue(feedbackService.declineFeedback(5L));
        assertEquals(ComplaintStatus.DECLINED, feedback.getStatus());
        verify(feedbackRepository).save(feedback);
    }
}
