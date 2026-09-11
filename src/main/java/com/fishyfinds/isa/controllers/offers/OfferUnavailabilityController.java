package com.fishyfinds.isa.controllers.offers;

import com.fishyfinds.isa.model.beans.offers.OfferUnavailability;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.offers.OfferUnavailabilityService;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class OfferUnavailabilityController {

    @Autowired
    private OfferUnavailabilityService unavailabilityService;
    @Autowired
    private TokenUtils tokenUtils;

    @GetMapping("/ownerOffers")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public List<Map<String, Object>> ownerOffers(@RequestHeader("Authorization") HttpHeaders header) {
        try {
            return unavailabilityService.ownerOffers(extractUsername(header));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PostMapping("/offerUnavailability")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public Object addUnavailability(@RequestHeader("Authorization") HttpHeaders header,
                                    @RequestBody Map<String, String> body) {
        try {
            Long offerId = Long.parseLong(body.get("offerId"));
            LocalDateTime start = LocalDateTime.parse(normalizeDateTime(body.get("startDate")));
            LocalDateTime end = LocalDateTime.parse(normalizeDateTime(body.get("endDate")));
            OfferUnavailability saved = unavailabilityService.add(extractUsername(header), offerId, start, end);
            if (saved == null) {
                return false;
            }
            return toMap(saved);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/offerUnavailability")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public List<Map<String, Object>> listForOwner(@RequestHeader("Authorization") HttpHeaders header) {
        try {
            List<Map<String, Object>> rows = new ArrayList<>();
            for (OfferUnavailability u : unavailabilityService.listForOwner(extractUsername(header))) {
                rows.add(toMap(u));
            }
            return rows;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/offerUnavailability/{offerId}")
    public List<Map<String, Object>> listByOffer(@PathVariable Long offerId) {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (OfferUnavailability u : unavailabilityService.listForOffer(offerId)) {
            rows.add(toMap(u));
        }
        return rows;
    }

    @PostMapping("/deleteOfferUnavailability")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public boolean delete(@RequestHeader("Authorization") HttpHeaders header,
                          @RequestBody Map<String, String> body) {
        try {
            return unavailabilityService.delete(extractUsername(header), Long.parseLong(body.get("id")));
        } catch (Exception e) {
            return false;
        }
    }

    private Map<String, Object> toMap(OfferUnavailability u) {
        Map<String, Object> row = new HashMap<>();
        row.put("id", u.getId());
        row.put("offerId", u.getOffer() != null ? u.getOffer().getId() : null);
        row.put("offerName", u.getOffer() != null ? u.getOffer().getOfferName() : null);
        row.put("startDate", u.getStartDate());
        row.put("endDate", u.getEndDate());
        row.put("unavailable", true);
        return row;
    }

    private String normalizeDateTime(String value) {
        if (value == null) {
            return null;
        }
        String v = value.trim();
        if (v.length() == 16) {
            return v + ":00";
        }
        if (v.contains(" ")) {
            return v.replace(' ', 'T');
        }
        return v;
    }

    private String extractUsername(HttpHeaders header) throws JSONException {
        final String value = header.getFirst(HttpHeaders.AUTHORIZATION);
        final JSONObject obj = new JSONObject(value);
        return tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
    }
}
