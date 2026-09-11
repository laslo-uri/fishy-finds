package com.fishyfinds.isa.service.offers;

import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.offers.OfferUnavailability;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.offers.OfferUnavailabilityRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OfferUnavailabilityService {

    @Autowired
    private OfferUnavailabilityRepository unavailabilityRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private UserRepository userRepository;

    public OfferUnavailability add(String username, Long offerId, LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null || !end.isAfter(start)) {
            return null;
        }
        User user = userRepository.findByEmail(username);
        Offer offer = offerRepository.findById(offerId).orElse(null);
        if (user == null || offer == null || offer.isDeleted() || offer.getUser() == null
                || !offer.getUser().getId().equals(user.getId())) {
            return null;
        }
        OfferUnavailability block = new OfferUnavailability(offer, start, end);
        return unavailabilityRepository.save(block);
    }

    public List<OfferUnavailability> listForOffer(Long offerId) {
        return unavailabilityRepository.findAllByOfferId(offerId);
    }

    public List<OfferUnavailability> listForOwner(String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return new ArrayList<>();
        }
        List<Offer> offers = offerRepository.findAllByUser(user);
        List<OfferUnavailability> result = new ArrayList<>();
        for (Offer offer : offers) {
            if (offer == null || offer.isDeleted()) {
                continue;
            }
            result.addAll(unavailabilityRepository.findAllByOffer(offer));
        }
        return result;
    }

    public List<Map<String, Object>> ownerOffers(String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return new ArrayList<>();
        }
        return offerRepository.findAllByUser(user).stream()
                .filter(o -> o != null && !o.isDeleted())
                .map(o -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("id", o.getId());
                    row.put("offerName", o.getOfferName());
                    row.put("offerType", o.getOfferType() != null ? o.getOfferType().name() : "");
                    return row;
                })
                .collect(Collectors.toList());
    }

    public boolean overlaps(Long offerId, LocalDateTime start, LocalDateTime end) {
        if (offerId == null || start == null || end == null) {
            return false;
        }
        for (OfferUnavailability block : unavailabilityRepository.findAllByOfferId(offerId)) {
            if (block.getStartDate() == null || block.getEndDate() == null) {
                continue;
            }
            boolean overlap = !end.isBefore(block.getStartDate()) && !start.isAfter(block.getEndDate());
            if (overlap) {
                return true;
            }
        }
        return false;
    }

    public boolean delete(String username, Long id) {
        User user = userRepository.findByEmail(username);
        OfferUnavailability block = unavailabilityRepository.findById(id).orElse(null);
        if (user == null || block == null || block.getOffer() == null
                || block.getOffer().getUser() == null
                || !block.getOffer().getUser().getId().equals(user.getId())) {
            return false;
        }
        unavailabilityRepository.delete(block);
        return true;
    }
}
