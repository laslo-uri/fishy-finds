package com.fishyfinds.isa.controllers;

import com.fishyfinds.isa.mappers.DtoToResolveComplaint;
import com.fishyfinds.isa.mappers.DtoToResolveDeleteRequest;
import com.fishyfinds.isa.model.beans.Complaint;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.AuthenticationService;
import com.fishyfinds.isa.service.ComplaintService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value="/api", produces= MediaType.APPLICATION_JSON_VALUE)
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/addComplaint")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public boolean addComplaint(@RequestHeader("Authorization") HttpHeaders header, @RequestBody Map<String, String> message){
        try {
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            return complaintService.add(username, message.get("content"), message.get("reservationId"), message.get("complaintType"));

        }catch(Exception e){
        }
        return  false;
    }

    @GetMapping("/allPendingComplaints")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Complaint> findAllPending(){
        return complaintService.findAllPending();
    }

    @GetMapping("/allAcceptedComplaints")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Complaint> findAllAccepted(){
        return complaintService.findAllAccepted();
    }

    @PostMapping("/acceptComplaint")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean acceptComplaint(@RequestBody Map<String, String> message){
        try {

            return complaintService.acceptComplaint(DtoToResolveComplaint.MapToResolveRequest(message));

        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }

    @PostMapping("/denyComplaint")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean denyComplaint(@RequestBody Map<String,String>map){
        try{
            return complaintService.denyComplaint(DtoToResolveComplaint.MapToResolveRequest(map));
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }
}
