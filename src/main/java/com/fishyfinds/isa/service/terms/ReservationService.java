package com.fishyfinds.isa.service.terms;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.terms.CancelledReservation;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.terms.Term;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.model.enums.ReservationStatus;
import com.fishyfinds.isa.model.enums.ReservationType;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.SubscriberRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.terms.CancelledReservationRepository;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import com.fishyfinds.isa.repository.terms.TermRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.service.MailService;
import com.fishyfinds.isa.service.PenalService;
import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private TermRepository termRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private MailService mailService;
    @Autowired
    private PenalService penalService;
    @Autowired
    private CancelledReservationRepository cancelledReservationRepositoty;
    @Autowired
    private CancelledReservationService cancelledReservationService;
    @Autowired
    private LoyaltyProgramRepository lRP;
    @Autowired
    private SubscriberRepository subscriberRepository;
    @Autowired
    private com.fishyfinds.isa.service.offers.OfferUnavailabilityService offerUnavailabilityService;

    private final int MAX_NUM_OF_DAYS_BEFORE_CANCELLING = 3;
    /**
     * Customer side method
     * @param message - map containing values same as in TermDTO
     * @param username - customer email
     * @return - boolean value depending on result of query execution - true -> success, fase -> failure
     */
    @Transactional
    public boolean makeReservation(Map<String, String> message, String username) {
        boolean retVal = false;
        try {
            Customer customer = customerRepository.findByEmail(username);
            if(customer == null) {
                return false;
            }
            Penal penal = penalService.getPenalForUser(customer.getEmail());
            int penalNumber = penal != null ? penal.getNumber() : 0;
            if(penalNumber < 3) {
                LocalDateTime startDate = LocalDateTime.parse(message.get("startDate"));
                int duration = Integer.parseInt(message.get("duration"));
                LocalDateTime endDate = startDate.plusDays(duration);
                Term term = termRepository.findById(Long.parseLong(message.get("termId"))).orElse(null);
                if (term != null && isFree(term, startDate, endDate)) {
                    List<CancelledReservation> cR = cancelledReservationService.findAllPassedReservationsForCustomer(username);
                    Offer offer = offerRepository.findById(Long.parseLong(message.get("offerId"))).orElse(null);
                    if(offer != null
                            && !offerUnavailabilityService.overlaps(offer.getId(), startDate, endDate)
                            && cR.stream().filter(r -> r.getOffer().getId() == offer.getId() && r.getStartDate().isEqual(startDate) &&
                            r.getEndDate().isEqual(endDate)).collect(Collectors.toList()).isEmpty()) {
                        int numberOfPeople = Integer.parseInt(message.get("numberOfPeople"));
                        double discount = customer.getLoyaltyProgram() != null ? customer.getLoyaltyProgram().getCategoryDiscount() / 100 : 0;
                        double totalPrice = numberOfPeople * offer.getUnitPrice() - numberOfPeople * offer.getUnitPrice() * discount;
                        Reservation reservation = new Reservation(startDate, endDate, customer, ReservationStatus.ACTIVE, ReservationType.DEFAULT,
                                numberOfPeople, totalPrice, offer);
                        reservation.setDuration(duration);
                        reservation.setDiscount(discount);
                        reservation.setAdditionalServices(message.get("additionalServices"));
                        reservationRepository.save(reservation);
                        updateTermsReservation(term.getId(), reservation);
                        customer.setEarnedPoints(customer.getEarnedPoints() + 5);
                        int earnedPoints = customer.getEarnedPoints();
                        if(earnedPoints >= 50 && earnedPoints < 100){
                            customer.setLoyaltyProgram(lRP.findById(2).orElse(null));
                        }else if(earnedPoints >= 100 && earnedPoints < 500){
                            customer.setLoyaltyProgram(lRP.findById(3).orElse(null));
                        }else if(earnedPoints >= 500){
                            customer.setLoyaltyProgram(lRP.findById(4).orElse(null));
                        }
                        customerRepository.save(customer);
                        try {
                            mailService.sendSuccessfulReservationEmail(customer, reservation);
                        } catch (Exception mailEx) {
                            // Demo env often has no SMTP; booking must still succeed.
                        }
                        retVal = true;
                    }
                }
            }
        }catch(Exception e){
            e.printStackTrace();
            retVal = false;
        }
        return retVal;
    }

    private boolean isFree(Term term, LocalDateTime startDate, LocalDateTime endDate){
        List<Reservation> reservations = term.getReservations();
        if (reservations == null) {
            reservations = new ArrayList<>();
        }
        boolean isInValidTermRange = startDate.isAfter(term.getStartDate()) && startDate.isBefore(term.getEndDate()) &&
                endDate.isBefore(term.getEndDate()) && endDate.isAfter(term.getStartDate());

        if(!isInValidTermRange)
            return false;

        for(Reservation r : reservations){
            if (r == null || r.getStartDate() == null || r.getEndDate() == null) {
                continue;
            }
            if((startDate.isAfter(r.getStartDate()) || startDate.isEqual(r.getStartDate())) && (startDate.isBefore(r.getEndDate()) || startDate.isEqual(r.getEndDate())) &&
                    (endDate.isBefore(r.getEndDate()) || endDate.isEqual(r.getEndDate())) && (endDate.isAfter(r.getStartDate()) || endDate.isEqual(r.getStartDate())) && r.getReservationStatus() != ReservationStatus.CANCELLED){
                return false;
            }
        }

        return true;
    }

    /**
     * Customer side method
     * @param id - reservation id
     * @param username - customer email
     * @return - boolean value depending on result of query execution - true -> success, fase -> failure
     */
    @Transactional
    public boolean makeReservationAction(Long id, String username){
        boolean retVal = false;
        Customer customer = customerRepository.findByEmail(username);
        if (customer == null) {
            return false;
        }
        Penal penal = penalService.getPenalForUser(customer.getEmail());
        int penalNumber = penal != null ? penal.getNumber() : 0;
        if(penalNumber < 3) {
            try {
                Reservation reservation = reservationRepository.findById(id).orElse(null);
                if (reservation != null) {
                    List<CancelledReservation> cR = cancelledReservationService.findAllPassedReservationsForCustomer(username);
                    if(cR.stream().filter(r -> r.getCancelledReservationId() == id).collect(Collectors.toList()).isEmpty()) {
                        reservation.setCustomer(customer);
                        reservation.setReservationStatus(ReservationStatus.ACTIVE);
                        reservationRepository.save(reservation);
                        customer.setEarnedPoints(customer.getEarnedPoints() + 5);
                        int earnedPoints = customer.getEarnedPoints();
                        if(earnedPoints >= 50 && earnedPoints < 100){
                            customer.setLoyaltyProgram(lRP.findById(2).orElse(null));
                        }else if(earnedPoints >= 100 && earnedPoints < 500){
                            customer.setLoyaltyProgram(lRP.findById(3).orElse(null));
                        }else if(earnedPoints >= 500){
                            customer.setLoyaltyProgram(lRP.findById(4).orElse(null));
                        }
                        customerRepository.save(customer);
                        try {
                            mailService.sendSuccessfulReservationEmail(customer, reservation);
                        } catch (Exception mailEx) {
                            // Demo env often has no SMTP; booking must still succeed.
                        }
                        retVal = true;
                    }else{
                        retVal = false;
                    }
                }
            } catch (Exception e) {
                retVal = false;
            }
        }
        return retVal;
    }

    @Transactional
    private void updateTermsReservation(Long termId, Reservation reservation){
        Term term = termRepository.findById(termId).orElse(null);
        if(term != null){
            term.getReservations().add(reservation);
            termRepository.save(term);
        }
    }

    public boolean cancelReservation(Long id) {
        boolean retVal = true;
        try{
            Reservation reservation = reservationRepository.findById(id).orElse(null);
            LocalDateTime dateTimeNow = LocalDateTime.now();
            if( reservation != null && dateTimeNow.plusDays(MAX_NUM_OF_DAYS_BEFORE_CANCELLING).isBefore(reservation.getStartDate())){
                reservation.setReservationStatus(ReservationStatus.CANCELLED);
                CancelledReservation cancelledReservation = new CancelledReservation(reservation);
                reservation.setCustomer(null);
                reservationRepository.save(reservation);
                cancelledReservationRepositoty.save(cancelledReservation);
            }else{
                retVal = false;
            }

        }catch(Exception e){
            retVal = false;
        }

        return retVal;
    }

    public List<Reservation> historyOfReservationsForCustomer(String username){
        List<Reservation> reservations = reservationRepository.findAllPassedReservationsForCustomer(username, LocalDateTime.now());
        return reservations != null ? reservations : new ArrayList<>();
    }

    public List<Reservation> upcomingReservationsForCustomer(String username) {
        return reservationRepository.findAllUpcomingReservationsForUser(username, LocalDateTime.now());
    }

    public List<Reservation> getActionsForOffer(Long id) {
        List<Reservation> allActions = reservationRepository.findAllActionsForOffer(id, LocalDateTime.now());
        if(allActions != null){
            allActions = allActions.stream().filter(a ->{
                return a.getReservationType() == ReservationType.QUICK && (a.getReservationStatus() == ReservationStatus.CANCELLED
                        || (a.getReservationStatus() == ReservationStatus.ACTIVE && a.getCustomer() == null));
            }).collect(Collectors.toList());
        }
        return allActions;
    }

    public List<Reservation> allPassedReservationsForCustomerWithoutDuplicatedOffers(String username) {
        List<Reservation> reservations = reservationRepository.findAllPassedReservationsForCustomer(username, LocalDateTime.now());
        List<Reservation> retVal = new ArrayList<>();
        if(reservations != null){
            retVal = reservations.stream().filter(r -> r.getReservationStatus() == ReservationStatus.ACTIVE && !r.isHasComplaint()).collect(Collectors.toList());
        }
        return retVal;
    }

    /**
     * Owner/instructor books an agreed reservation for an existing customer (spec 3.16).
     */
    @Transactional
    public boolean makeReservationForClient(Map<String, String> message, String ownerEmail) {
        try {
            User owner = offerRepository.findById(Long.parseLong(message.get("offerId")))
                    .map(Offer::getUser).orElse(null);
            if (owner == null || owner.getEmail() == null || !owner.getEmail().equalsIgnoreCase(ownerEmail)) {
                return false;
            }
            String customerEmail = message.get("customerEmail");
            if (customerEmail == null || customerEmail.isEmpty()) {
                return false;
            }
            return makeReservation(message, customerEmail);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Owner/instructor creates a QUICK action slot (open reservation with no customer yet).
     */
    @Transactional
    public boolean createQuickAction(Map<String, String> message, String ownerEmail) {
        try {
            Long offerId = Long.parseLong(message.get("offerId"));
            Offer offer = offerRepository.findById(offerId).orElse(null);
            if (offer == null || offer.getUser() == null || offer.getUser().getEmail() == null
                    || !offer.getUser().getEmail().equalsIgnoreCase(ownerEmail)) {
                return false;
            }
            LocalDateTime startDate = LocalDateTime.parse(message.get("startDate"));
            int duration = Integer.parseInt(message.getOrDefault("duration", "1"));
            LocalDateTime endDate = startDate.plusDays(Math.max(duration, 1));
            if (hasOverlappingActiveReservation(offerId, startDate, endDate)
                    || offerUnavailabilityService.overlaps(offerId, startDate, endDate)) {
                return false;
            }
            int numberOfPeople = Integer.parseInt(message.getOrDefault("numberOfPeople", "1"));
            double totalPrice = Double.parseDouble(message.getOrDefault("totalPrice",
                    String.valueOf(offer.getUnitPrice() * numberOfPeople)));
            double discount = Double.parseDouble(message.getOrDefault("discount", "0"));
            Reservation action = new Reservation(startDate, endDate, null, ReservationStatus.ACTIVE,
                    ReservationType.QUICK, numberOfPeople, totalPrice, offer);
            action.setDuration(duration);
            action.setDiscount(discount);
            action.setAdditionalServices(message.getOrDefault("additionalServices", ""));
            reservationRepository.save(action);
            notifySubscribersOfNewAction(offer, action);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean hasOverlappingActiveReservation(Long offerId, LocalDateTime start, LocalDateTime end) {
        for (Reservation r : reservationRepository.findAll()) {
            if (r.getOffer() == null || !offerId.equals(r.getOffer().getId())) {
                continue;
            }
            if (r.getReservationStatus() == ReservationStatus.CANCELLED) {
                continue;
            }
            if (r.getStartDate() == null || r.getEndDate() == null) {
                continue;
            }
            boolean overlaps = !end.isBefore(r.getStartDate()) && !start.isAfter(r.getEndDate());
            if (overlaps) {
                return true;
            }
        }
        return false;
    }

    private void notifySubscribersOfNewAction(Offer offer, Reservation action) {
        try {
            List<com.fishyfinds.isa.model.beans.Subscriber> subscribers =
                    subscriberRepository.findAllByFollowing(offer);
            for (com.fishyfinds.isa.model.beans.Subscriber s : subscribers) {
                if (s != null && s.isRelevant() && s.getFollower() instanceof Customer) {
                    mailService.sendNewActionEmail((Customer) s.getFollower(), action);
                }
            }
        } catch (Exception ignored) {
        }
    }
}
