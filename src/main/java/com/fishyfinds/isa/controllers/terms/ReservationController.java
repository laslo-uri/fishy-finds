package com.fishyfinds.isa.controllers.terms;

import com.fishyfinds.isa.dto.ReservationDto;
import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.terms.CancelledReservation;
import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.terms.CancelledReservationService;
import com.fishyfinds.isa.service.terms.ReservationService;
import com.fishyfinds.isa.service.terms.TermService;
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
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private CancelledReservationService cancelledReservationService;

    @Autowired
    private TokenUtils tokenUtils;
    @PostMapping("/makeReservation")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public boolean makeReservation(@RequestHeader HttpHeaders header,
                                   @RequestBody Map<String, String> message){
        try {
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            return reservationService.makeReservation(message, username);

        }catch(Exception e){
        }

        return false;
    }

    @PostMapping("/makeReservationForClient")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public boolean makeReservationForClient(@RequestHeader HttpHeaders header,
                                            @RequestBody Map<String, String> message){
        try {
            final String value = header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            return reservationService.makeReservationForClient(message, username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @PostMapping("/createQuickAction")
    @PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR')")
    public boolean createQuickAction(@RequestHeader HttpHeaders header,
                                     @RequestBody Map<String, String> message) {
        try {
            final String value = header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            return reservationService.createQuickAction(message, username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @PostMapping("/makeReservationAction")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public boolean makeReservationAction(@RequestHeader HttpHeaders header,
                                            @RequestBody Map<String, String> id){
        try {
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            return reservationService.makeReservationAction(Long.valueOf(id.get("id")), username);

        }catch(Exception e){
        }

        return false;
    }

    @PostMapping("/cancelReservation")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public boolean cancelReservation(@RequestBody Map<String, String> id){
        return reservationService.cancelReservation(Long.parseLong(id.get("id")));
    }

    @PostMapping("/historyOfReservationsForCustomer")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public List<ReservationDto> historyOfReservationsForCustomer(@RequestHeader HttpHeaders header, @RequestBody Map<String, String> offerType){

        try {
            List<ReservationDto> retVal = new ArrayList<>();
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            List<Reservation> reservations = reservationService.historyOfReservationsForCustomer(username);
            List<CancelledReservation> cancelledReservations = cancelledReservationService.findAllPassedReservationsForCustomer(username);
            OfferType oft = OfferType.INVALID;
            switch(offerType.get("offerType")){
                case "BUNGALOW": oft = OfferType.BUNGALOW;
                break;
                case "BOAT": oft = OfferType.BOAT;
                break;
                case "COURSE": oft = OfferType.COURSE;
                break;
            }
            final OfferType finalOft = oft;
            reservations = reservations.stream().filter(r ->{ return r.getOffer() != null && r.getOffer().getOfferType() == finalOft;}).collect(Collectors.toList());
            cancelledReservations = cancelledReservations.stream().filter(r ->{ return r.getOffer() != null && r.getOffer().getOfferType() == finalOft;}).collect(Collectors.toList());
            if(reservations != null){
                for(Reservation r : reservations){
                    ReservationDto d = new ReservationDto(r);
                    d.setPath(r.getOffer().getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                    retVal.add(d);
                }
            }
            if(cancelledReservations != null){
                for(CancelledReservation r : cancelledReservations){
                    ReservationDto d = new ReservationDto(r);
                    d.setPath(r.getOffer().getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                    retVal.add(d);
                }
            }

            return retVal;

        }catch(Exception e){
            e.printStackTrace();
        }

        return new ArrayList<>();
    }
    @GetMapping("/upcomingReservationsForCustomer")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public List<ReservationDto> upcomingReservationsForCustomer(@RequestHeader HttpHeaders header){
        try {
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            List<Reservation> res = reservationService.upcomingReservationsForCustomer(username);
            List<ReservationDto> retVal = new ArrayList<>();
            if(res != null){
                for(Reservation r : res){
                    ReservationDto d = new ReservationDto(r);
                    d.setPath(r.getOffer().getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                    retVal.add(d);
                }
            }
            return retVal;

        }catch(Exception e){
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    @GetMapping("/allPassedReservationsForCustomerWithoutDuplicatedOffers")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public List<ReservationDto> allPassedReservationsForCustomerWithoutDuplicatedOffers(@RequestHeader HttpHeaders header){
        try {
            final String value =header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            List<Reservation> res = reservationService.allPassedReservationsForCustomerWithoutDuplicatedOffers(username);
            List<ReservationDto> retVal = new ArrayList<>();
            if(res != null){
                for(Reservation r : res){
                    ReservationDto d = new ReservationDto(r);
                    d.setPath(r.getOffer().getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                    retVal.add(d);
                }
            }
            return retVal;

        }catch(Exception e){
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    @PostMapping("/getActionsForOffer")
    public List<ReservationDto> getActionsForOffer(@RequestBody Map<String, String> id){
        List<Reservation> res = reservationService.getActionsForOffer(Long.valueOf(id.get("id")));
        List<ReservationDto> retVal = new ArrayList<>();
        if(res != null){
            for(Reservation r : res){
                ReservationDto d = new ReservationDto(r);
                d.setPath(r.getOffer().getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                retVal.add(d);
            }
        }
        return retVal;
    }
}
