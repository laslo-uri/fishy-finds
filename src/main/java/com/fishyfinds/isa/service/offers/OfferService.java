package com.fishyfinds.isa.service.offers;

import com.fishyfinds.isa.dto.TermDTO;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.Location;
import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.repository.offers.BoatRepository;
import com.fishyfinds.isa.repository.offers.BungalowRepository;
import com.fishyfinds.isa.repository.offers.CourseRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.users.ImageItemRepository;
import com.fishyfinds.isa.service.terms.TermService;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.enums.ReservationStatus;
import com.fishyfinds.isa.repository.terms.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OfferService {

    @Autowired
    private  OfferRepository offerRepository;
    @Autowired
    private BoatRepository boatRepository;
    @Autowired
    private BungalowRepository bungalowRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private ImageItemRepository imageItemRepository;
    @Autowired
    private TermService termService;
    @Autowired
    private ReservationRepository reservationRepository;

    public List<? extends Offer> search(String name, String location, OfferType type, String firstLastName, LocalDateTime startDate, LocalDateTime endDate){
        List<? extends Offer> searched;

        if(type == OfferType.BUNGALOW) {
            searched = bungalowRepository.findAll();
        }
        else if(type == OfferType.COURSE){
            searched = courseRepository.findAll();
        }
        else{
            searched = boatRepository.findAll();
        }
        searched = searched.stream().filter(o -> !o.isDeleted()).collect(java.util.stream.Collectors.toList());

        if(name.equals("") && location.equals("") && firstLastName.equals("") && startDate == null && endDate == null)
            return searched;

        List<Offer> retVal = new ArrayList<>();
        for(int i = 0; i < searched.size(); ++i){
            if(checkPatternOffer(searched.get(i).getId(), name, location)) {
                retVal.add(searched.get(i));
            }
        }
        if(name.equals("") && location.equals(""))
            retVal = (List<Offer>)searched;

        if(!firstLastName.equals("")){
            List<Offer> retValInst = new ArrayList<>();
            if(name.equals("") && location.equals(""))
                retVal = (List<Offer>)searched;
            for(int i = 0; i < retVal.size(); ++i){
                if(checkPatternInstructorName(retVal.get(i).getUser().getFirstName() + retVal.get(i).getUser().getLastName(), firstLastName))
                    retValInst.add(retVal.get(i));
            }
            retVal = retValInst;
        }

        if(startDate != null && endDate != null){
            List<TermDTO> terms = termService.filterAvailableTerms(startDate, endDate, type.toString());
            List<Offer> retValTemp = new ArrayList<>();
            OUTER: for(Offer o : retVal){
               for(TermDTO t : terms){
                    if(o.getId() == t.getOffer().getId()){
                        retValTemp.add(o);
                        continue OUTER;
                    }
                }
            }
            retVal = retValTemp;
        }

        return retVal;
    }

    public List<? extends Offer> searchMyOffers(Long loggedUserId, String name, String location, OfferType type, String firstLastName){
        List<? extends Offer> searched = search(name, location, type,firstLastName, null, null);
        List<Offer> searchedMyOffers = new ArrayList<>();
        for(Offer offer : searched){
            if(offer.getUser().getId() == loggedUserId){
                searchedMyOffers.add(offer);
            }
        }
        return searchedMyOffers;
    }

        private  boolean checkPatternOffer(Long id, String name, String location){
        Offer offer = offerRepository.findById(id).orElseGet(null);
        if(!name.equals("") && !location.equals(""))
            return checkPatternName(offer.getOfferName(), name) && checkPatternLocation(offer.getLocation(), location);
        return checkPatternName(offer.getOfferName(), name) || checkPatternLocation(offer.getLocation(), location);
    }

    private boolean checkPatternInstructorName(String firstLastNameToCheck, String firstLastName){
        Pattern patternName = Pattern.compile(firstLastName, Pattern.CASE_INSENSITIVE);
        Matcher matcher = patternName.matcher(firstLastNameToCheck);
        return matcher.find();
    }

    private boolean checkPatternName(String offerName, String name){
        boolean retVal = false;
        if(!name.equals("")){
            Pattern patternName = Pattern.compile(name, Pattern.CASE_INSENSITIVE);
            Matcher matcher = patternName.matcher(offerName);
            retVal = matcher.find();
        }
        return retVal;
    }

    private boolean checkPatternLocation(Location offerLocation, String location){
        boolean retVal = false;
        if(!location.equals("")){
            Pattern patternName = Pattern.compile(location, Pattern.CASE_INSENSITIVE);
            Matcher matcher = patternName.matcher(offerLocation.getStreet() + offerLocation.getStreetNumber() + offerLocation.getCity() + offerLocation.getCountry());
            retVal = matcher.find();
        }
        return retVal;
    }

    public Offer findOfferByOfferId(Long offerId){
        for(Offer offer : offerRepository.findAll()){
            if(offer.getId().equals(offerId)){
                return offer;
            }
        }
        return null;
    }

    public ArrayList<Offer> getBungalowsByOwner(User bungalowOwner) {
        return (ArrayList<Offer>)offerRepository.findAllByUser(bungalowOwner);
    }


    public List<ImageItem> getAllImages(){
        if(!imageItemRepository.findAll().isEmpty()){
            return imageItemRepository.findAll();
        }
        return new ArrayList<ImageItem>();
    }

    public List<Offer> findAllActiveOffers() {
        List<Offer> result = new ArrayList<>();
        for (Offer offer : offerRepository.findAll()) {
            if (!offer.isDeleted()) {
                result.add(offer);
            }
        }
        return result;
    }

    public boolean softDeleteOffer(Long offerId) {
        Offer offer = offerRepository.findById(offerId).orElse(null);
        if (offer == null || offer.isDeleted()) {
            return false;
        }
        if (hasActiveReservation(offerId)) {
            return false;
        }
        offer.setDeleted(true);
        offerRepository.save(offer);
        return true;
    }

    public boolean softDeleteOfferForOwner(Long offerId, String ownerEmail) {
        Offer offer = offerRepository.findById(offerId).orElse(null);
        if (offer == null || offer.getUser() == null || offer.getUser().getEmail() == null) {
            return false;
        }
        if (!offer.getUser().getEmail().equalsIgnoreCase(ownerEmail)) {
            return false;
        }
        return softDeleteOffer(offerId);
    }

    public boolean hasActiveReservation(Long offerId) {
        LocalDateTime now = LocalDateTime.now();
        for (Reservation r : reservationRepository.findAll()) {
            if (r.getOffer() != null
                    && offerId.equals(r.getOffer().getId())
                    && r.getReservationStatus() == ReservationStatus.ACTIVE
                    && r.getEndDate() != null
                    && r.getEndDate().isAfter(now)) {
                return true;
            }
        }
        return false;
    }
}
