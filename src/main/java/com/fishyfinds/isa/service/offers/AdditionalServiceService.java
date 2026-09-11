package com.fishyfinds.isa.service.offers;

import com.fishyfinds.isa.model.beans.offers.AdditionalService;
import com.fishyfinds.isa.model.enums.AdditionalServiceType;
import com.fishyfinds.isa.repository.offers.AdditionalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AdditionalServiceService {

    @Autowired
    private AdditionalServiceRepository additionalServiceRepository;

    public ArrayList<AdditionalService> getAllAdditionalServicesForBungalows() {
        ArrayList<AdditionalService> allAdditionalServices = new ArrayList<AdditionalService>();
        for (AdditionalService additonalServ : (ArrayList<AdditionalService>) additionalServiceRepository.findAll()) {
            if(additonalServ.getType() == AdditionalServiceType.ADDITIONAL_SERVICE){
                allAdditionalServices.add(additonalServ);
            }
        }
        return allAdditionalServices;
    }

    public ArrayList<AdditionalService> getAllAdditionalServicesForBoatsAndCourses() {
        return (ArrayList<AdditionalService>) additionalServiceRepository.findAll();
    }




}
