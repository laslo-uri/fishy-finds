package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.UserFeedback;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import com.fishyfinds.isa.repository.FeedbackRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private MailService mailService;

    public boolean addFeedback(String username, UserFeedback feedback){
        Reservation r = reservationRepository.findById(feedback.getReservation().getId()).orElse(null);
        r.setHasFeedback(true);
        feedback.setStatus(ComplaintStatus.PENDING);
        feedbackRepository.save(feedback);
        reservationRepository.save(r);
        return true;
    }

    public List<UserFeedback> findAllPending() {
        List<UserFeedback> allPendingFeedbacks = new ArrayList<>();
        for(UserFeedback f : feedbackRepository.findAll()){
            if(f.getStatus()==ComplaintStatus.PENDING){
                allPendingFeedbacks.add(f);
            }
        }
        return allPendingFeedbacks;
    }

    public List<UserFeedback> findAllAcceptedFeedbacks() {
        List<UserFeedback> allAcceptedFeedbacks = new ArrayList<>();
        for(UserFeedback f : feedbackRepository.findAll()){
            if(f.getStatus()==ComplaintStatus.ACCEPTED){
                allAcceptedFeedbacks.add(f);
            }
        }
        return allAcceptedFeedbacks;
    }

    public boolean acceptFeedback(Long id) {
        UserFeedback feedback = feedbackRepository.findById(id.intValue()).orElse(null);
        if (feedback == null) {
            return false;
        }
        feedback.setStatus(ComplaintStatus.ACCEPTED);
        feedbackRepository.save(feedback);
        try {
            if (feedback.getReservation() != null
                    && feedback.getReservation().getOffer() != null
                    && feedback.getReservation().getOffer().getUser() != null) {
                String ownerEmail = feedback.getReservation().getOffer().getUser().getEmail();
                String content = feedback.getContentForOwner() != null
                        ? feedback.getContentForOwner()
                        : feedback.getContentForOffer();
                mailService.sendFeedbackApprovedEmail(ownerEmail, content != null ? content : "");
            }
        } catch (Exception ignored) {
        }
        return true;
    }

    public boolean declineFeedback(Long id) {
        UserFeedback feedback = feedbackRepository.findById(id.intValue()).orElse(null);
        if (feedback == null) {
            return false;
        }
        feedback.setStatus(ComplaintStatus.DECLINED);
        feedbackRepository.save(feedback);
        return true;
    }
}
