package com.fishyfinds.isa.controllers.offers;

import com.fishyfinds.isa.model.beans.offers.AdditionalService;
import com.fishyfinds.isa.service.offers.AdditionalServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping(value="/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdditionalServiceController {


    @Autowired
    private AdditionalServiceService additionalServiceService;

    @GetMapping("/getAllAdditionalServicesForBungalows")
    public ArrayList<AdditionalService> getAllAdditionalServicesForBungalows() {
        return additionalServiceService.getAllAdditionalServicesForBungalows();
    }

    @GetMapping("/getAllAdditionalServicesForBoatsAndCourses")
    public ArrayList<AdditionalService> getAllAdditionalServicesForBoatsAndCourses() {
        return additionalServiceService.getAllAdditionalServicesForBoatsAndCourses();
    }



}
