package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OwnerAnalyticsService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Reservation> getReservationsForOwner(String username) {
        return reservationRepository.findAll().stream()
                .filter(r -> r.getOffer() != null
                        && r.getOffer().getUser() != null
                        && username.equals(r.getOffer().getUser().getEmail()))
                .collect(Collectors.toList());
    }

    public Map<String, Object> getReportsForOwner(String username) {
        List<Reservation> reservations = getReservationsForOwner(username);
        User owner = userRepository.findByEmail(username);
        List<Offer> offers = owner != null ? offerRepository.findAllByUser(owner) : new ArrayList<>();

        double averageRating = 0;
        if (!offers.isEmpty()) {
            double sum = 0;
            for (Offer offer : offers) {
                sum += offer.getRating();
            }
            averageRating = sum / offers.size();
        }

        double totalIncome = 0;
        for (Reservation reservation : reservations) {
            totalIncome += reservation.getTotalPrice();
        }

        Map<String, Object> report = new HashMap<>();
        report.put("averageRating", averageRating);
        report.put("totalIncome", totalIncome);
        report.put("weeklyCounts", buildWeeklyCounts(reservations));
        report.put("monthlyCounts", buildMonthlyCounts(reservations));
        report.put("yearlyCounts", buildYearlyCounts(reservations));
        return report;
    }

    private List<Integer> buildWeeklyCounts(List<Reservation> reservations) {
        LocalDate today = LocalDate.now();
        List<Integer> counts = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            int count = 0;
            for (Reservation reservation : reservations) {
                LocalDateTime start = reservation.getStartDate();
                if (start != null && start.toLocalDate().equals(day)) {
                    count++;
                }
            }
            counts.add(count);
        }
        return counts;
    }

    private List<Integer> buildMonthlyCounts(List<Reservation> reservations) {
        int year = LocalDate.now().getYear();
        List<Integer> counts = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            int count = 0;
            for (Reservation reservation : reservations) {
                LocalDateTime start = reservation.getStartDate();
                if (start != null && start.getYear() == year && start.getMonthValue() == month) {
                    count++;
                }
            }
            counts.add(count);
        }
        return counts;
    }

    private List<Integer> buildYearlyCounts(List<Reservation> reservations) {
        int currentYear = LocalDate.now().getYear();
        List<Integer> counts = new ArrayList<>();
        for (int offset = 4; offset >= 0; offset--) {
            int year = currentYear - offset;
            int count = 0;
            for (Reservation reservation : reservations) {
                LocalDateTime start = reservation.getStartDate();
                if (start != null && start.getYear() == year) {
                    count++;
                }
            }
            counts.add(count);
        }
        return counts;
    }
}
