package com.fishyfinds.isa.controllers.offers;

import com.fishyfinds.isa.dto.OfferDTO;
import com.fishyfinds.isa.model.beans.Subscriber;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.beans.offers.courses.Course;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.ImageService;
import com.fishyfinds.isa.service.SubscriberService;
import com.fishyfinds.isa.service.offers.OfferService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value="/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class OfferController {

    @Autowired
    private OfferService offerService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private SubscriberService subscriberService;
    @GetMapping("/search")
    public List<OfferDTO> searchBungalows(@RequestHeader("Authorization") HttpHeaders header,
                                                 @RequestParam(name = "name", required = false) String name, //location = address + num + city + country
                                                 @RequestParam(name = "location", required = false) String location,
                                                 @RequestParam(name = "type", required = true) OfferType type,
                                                 @RequestParam(name = "firstLastName", defaultValue = "", required = false) String firstAndLastName,
                                                 @RequestParam(name = "startDate", required = false) String startDate,
                                                 @RequestParam(name = "endDate", required = false) String endDate){
        List<? extends Offer> offers = new ArrayList<>();
        if(startDate == null || startDate.equals("") && endDate == null || endDate.equals(""))
            offers = offerService.search(name, location, type, firstAndLastName, null,null);
        else
            offers = offerService.search(name, location, type, firstAndLastName, LocalDateTime.parse(startDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    LocalDateTime.parse(endDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        List<OfferDTO> retVal = new ArrayList<>();
        try {
            final String value = header.getFirst(HttpHeaders.AUTHORIZATION);
            if(value != null && !value.isEmpty()){
                final JSONObject obj = new JSONObject(value);
                String user = obj.getString("accessToken");
                String username = tokenUtils.getUsernameFromToken(user);
                List<Subscriber> subscribers = subscriberService.getSubscriptionsByUser(username);
                for(Offer b : offers){
                    OfferDTO dto = new OfferDTO();
                    dto.setPath(b.getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                    dto.setOffer(b);
                    for(Subscriber s : subscribers){
                        if(s.isRelevant() && s.getFollowing().getId().equals(b.getId())){
                            dto.setFollowed(true);
                            break;
                        }
                    }
                    retVal.add(dto);
                }}
            else{
                for(Offer b : offers){
                    OfferDTO dto = new OfferDTO();
                    dto.setPath(b.getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
                    dto.setOffer(b);
                    retVal.add(dto);
                }
            }
        }catch(Exception e){

        }
        return retVal;
    }

    @GetMapping("/search/{loggedUserId}")
    public List<? extends Offer> searchMyBungalows(@PathVariable Long loggedUserId,
                                                   @RequestParam(name = "name", required = false) String name, //location = address + num + city + country
                                                   @RequestParam(name = "location", required = false) String location,
                                                   @RequestParam(name = "type", required = true) OfferType type,
                                                   @RequestParam(name = "firstLastName", defaultValue = "", required = false) String firstAndLastName){
        return offerService.searchMyOffers(loggedUserId, name, location, type, firstAndLastName);
    }

    @PostMapping("/deleteMyOffer")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ROLE_BUNGALOW') or hasRole('ROLE_BOAT') or hasRole('ROLE_INSTRUCTOR') or hasRole('ROLE_ADMIN')")
    public boolean deleteMyOffer(@RequestHeader("Authorization") HttpHeaders header,
                                 @RequestBody java.util.Map<String, String> message) {
        try {
            final String value = header.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String accessToken = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(accessToken);
            return offerService.softDeleteOfferForOwner(Long.parseLong(message.get("id")), username);
        } catch (Exception e) {
            return false;
        }
    }
/*
    @GetMapping("/getAllImages/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) throws IOException {
        byte[] img = ImageService.getInstance().getImage()
        if(img != null){
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(img);
        }else{
            return ResponseEntity
                    .badRequest()
                    .contentType(MediaType.IMAGE_JPEG).body(null);
        }
    }
*/

}
