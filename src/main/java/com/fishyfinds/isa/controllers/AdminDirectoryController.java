package com.fishyfinds.isa.controllers;

import com.fishyfinds.isa.model.beans.offers.Offer;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.service.offers.OfferService;
import com.fishyfinds.isa.service.users.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminDirectoryController {

    @Autowired
    private UserService userService;
    @Autowired
    private OfferService offerService;

    @GetMapping("/allUsers")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<User> allUsers() {
        return userService.findAllUsers();
    }

    @DeleteMapping("/deleteUser/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @PostMapping("/deleteUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean deleteUserPost(@RequestBody Map<String, String> message) {
        try {
            return userService.deleteUser(Long.parseLong(message.get("id")));
        } catch (Exception e) {
            return false;
        }
    }

    @GetMapping("/allOffersAdmin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Offer> allOffers() {
        return offerService.findAllActiveOffers();
    }

    @PostMapping("/deleteOffer")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean deleteOffer(@RequestBody Map<String, String> message) {
        try {
            return offerService.softDeleteOffer(Long.parseLong(message.get("id")));
        } catch (Exception e) {
            return false;
        }
    }
}
