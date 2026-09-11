package com.fishyfinds.isa.service.offers;

import com.fishyfinds.isa.dto.AddNewBungalowDTO;
import com.fishyfinds.isa.model.beans.offers.AdditionalService;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.Location;
import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.repository.LocationRepository;
import com.fishyfinds.isa.repository.offers.BungalowRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.users.ImageItemRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class BungalowService {

    @Autowired
    private BungalowRepository bungalowRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageItemRepository imageItemRepository;
    @Autowired
    private OfferService offerService;

    @Cacheable("allBungalows")
    public List<Bungalow> findAll(){
        List<Bungalow> all = bungalowRepository.findAll();
        List<Bungalow> active = new ArrayList<>();
        for (Bungalow b : all) {
            if (!b.isDeleted()) {
                active.add(b);
            }
        }
        return active;
    }

    public boolean addNewBungalow(AddNewBungalowDTO addNewBungalowDto, String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) return false;
        Bungalow bungalow = new Bungalow();
        bungalow.setOfferType(OfferType.BUNGALOW);
        bungalow.setOfferName(addNewBungalowDto.getOfferName());
        Location location = new Location(addNewBungalowDto.getCountry(),
                addNewBungalowDto.getCity(),
                addNewBungalowDto.getStreet(),
                addNewBungalowDto.getStreetNumber());
        location.setLongitude(addNewBungalowDto.getLongitude());
        location.setLatitude(addNewBungalowDto.getLatitude());
        bungalow.setLocation(location);
        bungalow.setDescription(addNewBungalowDto.getDescription());
        bungalow.setUnitPrice(addNewBungalowDto.getUnitPrice());
        bungalow.setMaxCustomerCapacity(addNewBungalowDto.getMaxCustomerCapacity());
        bungalow.setNumberOfBeds(addNewBungalowDto.getNumberOfBeds());
        bungalow.setNumberOfRooms(addNewBungalowDto.getNumberOfRooms());
        bungalow.setRulesOfConduct(addNewBungalowDto.getRulesOfConduct());
        bungalow.setCancellationPolicy(addNewBungalowDto.getCancellationPolicy());
        bungalow.setAdditionalServices(new HashSet<AdditionalService>(addNewBungalowDto.getAdditionalServices()));
        ArrayList<ImageItem> images = new ArrayList<>();
        try {
            for (int i = 0; i < addNewBungalowDto.getImage().size(); ++i) {
                if (addNewBungalowDto.getImage().get(i) != null) {
                    String imageName = "bung" + "_"  +  (offerRepository.findAll().size()+1) + "_" + i + "_";
                    String imagePath = ImageService.getInstance().saveImage(addNewBungalowDto.getImage().get(i), imageName);
                    images.add(new ImageItem(imageName,imagePath,false));
                }
            }
        } catch (Exception e) {}
        bungalow.setImages(new HashSet<ImageItem>(images));
        System.out.println(images);
        bungalow.setUser(user);
        locationRepository.saveAndFlush(bungalow.getLocation());
        bungalowRepository.saveAndFlush(bungalow);
        return true;
    }

    public List<Bungalow> findAllByOwnerId(Long loggedUserId) {
        List<Bungalow> myBungalows = new ArrayList<Bungalow>();
        for(Bungalow bungalow : bungalowRepository.findAll()){
            if(!bungalow.isDeleted() && bungalow.getUser() != null && bungalow.getUser().getId().equals(loggedUserId)){
                myBungalows.add(bungalow);
            }
        }
        return myBungalows;
    }

    public Bungalow findByBungalowId(Long bungalowId){
        for(Bungalow bungalow : bungalowRepository.findAll()){
            if(bungalow.getId().equals(bungalowId)){
                return bungalow;
            }
        }
        return null;
    }

    public boolean updateBungalow(Long id, AddNewBungalowDTO dto, String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return false;
        }
        Bungalow bungalow = bungalowRepository.findById(id).orElse(null);
        if (bungalow == null || bungalow.isDeleted() || bungalow.getUser() == null
                || !bungalow.getUser().getId().equals(user.getId())) {
            return false;
        }
        if (offerService.hasActiveReservation(id)) {
            return false;
        }
        bungalow.setOfferName(dto.getOfferName());
        if (bungalow.getLocation() == null) {
            Location location = new Location(dto.getCountry(), dto.getCity(), dto.getStreet(), dto.getStreetNumber());
            location.setLongitude(dto.getLongitude());
            location.setLatitude(dto.getLatitude());
            bungalow.setLocation(location);
        } else {
            bungalow.getLocation().setCountry(dto.getCountry());
            bungalow.getLocation().setCity(dto.getCity());
            bungalow.getLocation().setStreet(dto.getStreet());
            bungalow.getLocation().setStreetNumber(dto.getStreetNumber());
            bungalow.getLocation().setLongitude(dto.getLongitude());
            bungalow.getLocation().setLatitude(dto.getLatitude());
        }
        bungalow.setDescription(dto.getDescription());
        bungalow.setUnitPrice(dto.getUnitPrice());
        bungalow.setMaxCustomerCapacity(dto.getMaxCustomerCapacity());
        bungalow.setNumberOfBeds(dto.getNumberOfBeds());
        bungalow.setNumberOfRooms(dto.getNumberOfRooms());
        bungalow.setRulesOfConduct(dto.getRulesOfConduct());
        bungalow.setCancellationPolicy(dto.getCancellationPolicy());
        if (dto.getAdditionalServices() != null) {
            bungalow.setAdditionalServices(new HashSet<>(dto.getAdditionalServices()));
        }
        locationRepository.saveAndFlush(bungalow.getLocation());
        bungalowRepository.saveAndFlush(bungalow);
        return true;
    }
}
