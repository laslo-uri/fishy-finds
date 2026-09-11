package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.Admin;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.users.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminFinanceService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    public Map<String, Object> getAdminIncome() {
        List<Admin> admins = adminRepository.findAll();
        double percentage = getCurrentPercentage(admins);

        double reservationTotal = 0;
        for (Reservation reservation : reservationRepository.findAll()) {
            reservationTotal += reservation.getTotalPrice();
        }
        double adminIncome = reservationTotal * percentage / 100.0;

        List<Double> earningPercentages = new ArrayList<>();
        for (Admin admin : admins) {
            earningPercentages.add(admin.getEarningPercentage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("adminIncome", adminIncome);
        result.put("earningPercentages", earningPercentages);
        result.put("percentage", percentage);
        return result;
    }

    public boolean setSystemCut(double percentage) {
        List<Admin> admins = adminRepository.findAll();
        if (admins.isEmpty()) {
            return false;
        }
        for (Admin admin : admins) {
            admin.setEarningPercentage(percentage);
            adminRepository.save(admin);
        }
        return true;
    }

    public double getSystemCut() {
        return getCurrentPercentage(adminRepository.findAll());
    }

    private double getCurrentPercentage(List<Admin> admins) {
        if (admins == null || admins.isEmpty()) {
            return 0;
        }
        return admins.get(0).getEarningPercentage();
    }
}
