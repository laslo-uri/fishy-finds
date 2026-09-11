package com.fishyfinds.isa.controllers;

import com.fishyfinds.isa.service.AdminFinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminFinanceController {

    @Autowired
    private AdminFinanceService adminFinanceService;

    @GetMapping("/adminIncome")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Map<String, Object> getAdminIncome() {
        try {
            return adminFinanceService.getAdminIncome();
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @PostMapping("/setSystemCut")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean setSystemCut(@RequestBody Map<String, Object> message) {
        try {
            Object percentageObj = message.get("percentage");
            if (percentageObj == null) {
                return false;
            }
            double percentage = Double.parseDouble(percentageObj.toString());
            return adminFinanceService.setSystemCut(percentage);
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/getSystemCut")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Map<String, Object> getSystemCut() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("percentage", adminFinanceService.getSystemCut());
        } catch (Exception e) {
            result.put("percentage", 0);
        }
        return result;
    }
}
