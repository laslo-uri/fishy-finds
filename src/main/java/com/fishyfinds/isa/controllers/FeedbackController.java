package com.fishyfinds.isa.controllers;

import com.fishyfinds.isa.mappers.DtoToFeedback;
import com.fishyfinds.isa.model.beans.UserFeedback;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.FeedbackService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value="/api", produces= MediaType.APPLICATION_JSON_VALUE)
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private TokenUtils tokenUtils;

    @PostMapping("/addFeedback")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public boolean addFeedback(@RequestHeader("Authorization") HttpHeaders header,@RequestBody Map<String, String> params) {
        try {
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            return feedbackService.addFeedback(username, DtoToFeedback.MapToUserFeedback(params));

        }catch(Exception e){
            e.printStackTrace();
        }
        return  false;
    }

    @GetMapping("/allPendingFeedbacks")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<UserFeedback> findAllPending(){
        return feedbackService.findAllPending();
    }

    @GetMapping("/allAcceptedFeedbacks")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<UserFeedback> findAllAcceptedFeedbacks(){
        return feedbackService.findAllAcceptedFeedbacks();
    }

    @PostMapping("/allAcceptedFeedbacksForOffer")
    public List<UserFeedback> findAllAcceptedFeedbacksForOffer(@RequestBody Map<String, String> id){
        List<UserFeedback> retVal = feedbackService.findAllAcceptedFeedbacks();
        return retVal != null ?
            retVal.stream().filter(r -> r.getReservation().getOffer().getId() == Long.parseLong(id.get("id"))).collect(Collectors.toList())
            : new ArrayList<>();

    }

    @PostMapping("/acceptFeedback")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean acceptFeedback(@RequestBody Map<String, String> message){
        try {
            return feedbackService.acceptFeedback(Long.parseLong(message.get("id")));
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping("/declineFeedback")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean declineFeedback(@RequestBody Map<String, String> message){
        try {
            return feedbackService.declineFeedback(Long.parseLong(message.get("id")));
        } catch (Exception e) {
            return false;
        }
    }
}
