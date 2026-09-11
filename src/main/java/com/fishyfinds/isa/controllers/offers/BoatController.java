package com.fishyfinds.isa.controllers.offers;

import com.fishyfinds.isa.dto.AddNewBoatDTO;
import com.fishyfinds.isa.dto.OfferDTO;
import com.fishyfinds.isa.model.beans.Subscriber;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.SubscriberService;
import com.fishyfinds.isa.service.offers.BoatService;
import com.fishyfinds.isa.service.users.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class BoatController {

    @Autowired
    private BoatService boatService;
    @Autowired
    private SubscriberService subscriberService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserService userService;

    @GetMapping("/allBoats")
    public List<OfferDTO> findAll(@RequestHeader(value = "Authorization", required = false) HttpHeaders header) {
        List<Boat> boats = boatService.findAll();
        List<OfferDTO> retVal = new ArrayList<>();
        List<Subscriber> subscribers = new ArrayList<>();
        try {
            final String value = header != null ? header.getFirst(HttpHeaders.AUTHORIZATION) : null;
            if (value != null && !value.isEmpty()) {
                final JSONObject obj = new JSONObject(value);
                String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
                subscribers = subscriberService.getSubscriptionsByUser(username);
            }
        } catch (Exception ignored) {
        }
        for (Boat boat : boats) {
            OfferDTO dto = new OfferDTO();
            dto.setOffer(boat);
            dto.setPath(resolveFirstImage(boat));
            for (Subscriber s : subscribers) {
                if (s.isRelevant() && s.getFollowing().getId().equals(boat.getId())) {
                    dto.setFollowed(true);
                    break;
                }
            }
            retVal.add(dto);
        }
        return retVal;
    }

    @GetMapping("/allMyBoats")
    @PreAuthorize("hasRole('ROLE_BOAT')")
    public List<Boat> findAllByOwnerId(@RequestHeader("Authorization") HttpHeaders header) {
        try {
            final JSONObject obj = new JSONObject(header.getFirst(HttpHeaders.AUTHORIZATION));
            String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
            User owner = userService.findUserByEmail(username);
            return boatService.findAllByOwnerId(owner.getId());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PostMapping("/addNewBoat")
    @PreAuthorize("hasRole('ROLE_BOAT')")
    public boolean addNewBoat(@RequestHeader("Authorization") HttpHeaders header,
                              @RequestBody AddNewBoatDTO dto) {
        try {
            final JSONObject obj = new JSONObject(header.getFirst(HttpHeaders.AUTHORIZATION));
            String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
            return boatService.addNewBoat(dto, username);
        } catch (Exception e) {
            return false;
        }
    }

    @PutMapping("/updateBoat/{id}")
    @PreAuthorize("hasRole('ROLE_BOAT')")
    public boolean updateBoat(@RequestHeader("Authorization") HttpHeaders header,
                              @PathVariable Long id,
                              @RequestBody AddNewBoatDTO dto) {
        try {
            final JSONObject obj = new JSONObject(header.getFirst(HttpHeaders.AUTHORIZATION));
            String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
            return boatService.updateBoat(id, dto, username);
        } catch (Exception e) {
            return false;
        }
    }

    private String resolveFirstImage(Boat boat) {
        if (boat.getImages() == null || boat.getImages().isEmpty()) {
            return "images/no-pictures.png";
        }
        Optional<ImageItem> first = boat.getImages().stream()
                .filter(i -> "first".equals(i.getName()))
                .findFirst();
        return first.map(ImageItem::getPath).orElse(boat.getImages().iterator().next().getPath());
    }
}
