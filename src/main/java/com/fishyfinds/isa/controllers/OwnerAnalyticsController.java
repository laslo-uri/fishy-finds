package com.fishyfinds.isa.controllers;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.OwnerAnalyticsService;
import com.fishyfinds.isa.service.VisitReportService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class OwnerAnalyticsController {

    @Autowired
    private OwnerAnalyticsService ownerAnalyticsService;
    @Autowired
    private VisitReportService visitReportService;
    @Autowired
    private TokenUtils tokenUtils;

    @GetMapping("/ownerReservations")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public List<Reservation> getOwnerReservations(@RequestHeader("Authorization") HttpHeaders header) {
        try {
            String username = extractUsername(header);
            return ownerAnalyticsService.getReservationsForOwner(username);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/ownerReports")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public Map<String, Object> getOwnerReports(@RequestHeader("Authorization") HttpHeaders header) {
        try {
            String username = extractUsername(header);
            return ownerAnalyticsService.getReportsForOwner(username);
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @PostMapping("/submitVisitReport")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public boolean submitVisitReport(@RequestHeader("Authorization") HttpHeaders header,
                                     @RequestBody Map<String, Object> message) {
        try {
            String username = extractUsername(header);
            return visitReportService.submitVisitReport(username, message);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/pendingPenalReports")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<com.fishyfinds.isa.model.beans.VisitReport> pendingPenalReports() {
        return visitReportService.findAllPendingPenalRequests();
    }

    @PostMapping("/approvePenalReport")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean approvePenalReport(@RequestBody Map<String, String> message) {
        try {
            return visitReportService.approvePenalRequest(Long.parseLong(message.get("id")));
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping("/declinePenalReport")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean declinePenalReport(@RequestBody Map<String, String> message) {
        try {
            return visitReportService.declinePenalRequest(Long.parseLong(message.get("id")));
        } catch (Exception e) {
            return false;
        }
    }

    private String extractUsername(HttpHeaders header) throws JSONException {
        final String value = header.getFirst(HttpHeaders.AUTHORIZATION);
        final JSONObject obj = new JSONObject(value);
        String accessToken = obj.getString("accessToken");
        return tokenUtils.getUsernameFromToken(accessToken);
    }
}
