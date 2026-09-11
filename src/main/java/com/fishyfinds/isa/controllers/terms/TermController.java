package com.fishyfinds.isa.controllers.terms;

import com.fishyfinds.isa.dto.TermDTO;
import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.terms.Term;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.AuthenticationService;
import com.fishyfinds.isa.service.offers.OfferService;
import com.fishyfinds.isa.service.terms.TermService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value="/api", produces= MediaType.APPLICATION_JSON_VALUE)
public class TermController {

    @Autowired
    private TermService termService;
    @Autowired
    private OfferService offerService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/filterAvailableTerms")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public List<TermDTO> filterAvailableTerms(@RequestBody Map<String, String> message){
        int duration = Integer.parseInt(message.get("duration"));
        LocalDateTime start = LocalDateTime.parse(message.get("start"));
        LocalDateTime end = start.plusDays(duration);
        List<TermDTO> retVal =  termService.filterAvailableTerms(start, end, message.get("offerType"), Integer.parseInt(message.get("numberOfPeople")));
        if(retVal != null) {
            for (TermDTO d : retVal){
                d.setPath(d.offer.getImages().stream().filter(i -> i.getName().equals("first")).collect(Collectors.toList()).get(0).getPath());
            }
        }
        return retVal;
    }

    @GetMapping("/getTermsByOfferId/{offerId}")
    public List<TermDTO> getTermsByOfferId(@PathVariable Long offerId) {
        return termService.getTermsByOfferId(offerId);
    }

    @PostMapping("/addNewTermToOffer/{offerId}")
    public boolean addNewTermToOffer(@RequestHeader("Authorization") HttpHeaders headers,
                                     @PathVariable Long offerId,
                                     @RequestBody TermDTO termDTO){
        try {
            final String value = headers.getFirst(HttpHeaders.AUTHORIZATION);
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            Offer offer = offerService.findOfferByOfferId(offerId);
            return termService.addNewTermToOffer(termDTO, offer);
        }catch(Exception e){
            e.printStackTrace();
        }
        return  false;
    }

    @PostMapping("/getTermById")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public Term getTermById(@RequestBody Map<String, String> id){
        return termService.getTermById(Long.parseLong(id.get("id")));
    }
}
