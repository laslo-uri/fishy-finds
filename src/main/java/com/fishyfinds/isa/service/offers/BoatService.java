package com.fishyfinds.isa.service.offers;

import com.fishyfinds.isa.dto.AddNewBoatDTO;
import com.fishyfinds.isa.model.beans.offers.AdditionalService;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.Location;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.offers.boats.Engine;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.repository.LocationRepository;
import com.fishyfinds.isa.repository.offers.BoatRepository;
import com.fishyfinds.isa.repository.offers.EngineRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class BoatService {

    @Autowired
    private BoatRepository boatRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EngineRepository engineRepository;
    @Autowired
    private OfferService offerService;

    @Cacheable("allBoats")
    public List<Boat> findAll() {
        List<Boat> all = boatRepository.findAll();
        List<Boat> active = new ArrayList<>();
        for (Boat boat : all) {
            if (!boat.isDeleted()) {
                active.add(boat);
            }
        }
        return active;
    }

    public List<Boat> findAllByOwnerId(Long ownerId) {
        List<Boat> mine = new ArrayList<>();
        for (Boat boat : boatRepository.findAll()) {
            if (!boat.isDeleted() && boat.getUser() != null && boat.getUser().getId().equals(ownerId)) {
                mine.add(boat);
            }
        }
        return mine;
    }

    public boolean addNewBoat(AddNewBoatDTO dto, String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return false;
        }
        Boat boat = new Boat();
        boat.setOfferType(OfferType.BOAT);
        boat.setOfferName(dto.getOfferName());
        Location location = new Location(dto.getCountry(), dto.getCity(), dto.getStreet(), dto.getStreetNumber());
        location.setLongitude(dto.getLongitude());
        location.setLatitude(dto.getLatitude());
        boat.setLocation(location);
        boat.setDescription(dto.getDescription());
        boat.setUnitPrice(dto.getUnitPrice());
        boat.setMaxCustomerCapacity(dto.getMaxCustomerCapacity());
        boat.setRulesOfConduct(dto.getRulesOfConduct());
        boat.setCancellationPolicy(dto.getCancellationPolicy());
        boat.setBoatType(dto.getBoatType() == null || dto.getBoatType().isEmpty() ? "Boat" : dto.getBoatType());
        boat.setBoatLength(dto.getBoatLength() <= 0 ? 5.0 : dto.getBoatLength());
        if (dto.getAdditionalServices() != null) {
            boat.setAdditionalServices(new HashSet<>(dto.getAdditionalServices()));
        }
        Engine engine = new Engine();
        engine.setNumberOfEngines(dto.getNumberOfEngines() <= 0 ? 1 : dto.getNumberOfEngines());
        engine.setPower(dto.getPower() <= 0 ? 50 : dto.getPower());
        engine.setMaxSpeed(dto.getMaxSpeed() <= 0 ? 30 : dto.getMaxSpeed());
        engineRepository.saveAndFlush(engine);
        boat.setEngine(engine);

        ArrayList<ImageItem> images = new ArrayList<>();
        try {
            if (dto.getImage() != null) {
                for (int i = 0; i < dto.getImage().size(); ++i) {
                    if (dto.getImage().get(i) != null) {
                        String imageName = "boat_" + (offerRepository.findAll().size() + 1) + "_" + i + "_";
                        String imagePath = ImageService.getInstance().saveImage(dto.getImage().get(i), imageName);
                        images.add(new ImageItem(imageName, imagePath, false));
                    }
                }
            }
        } catch (Exception ignored) {
        }
        if (images.isEmpty()) {
            images.add(new ImageItem("first", "images/no-pictures.png", false));
        } else {
            images.get(0).setName("first");
        }
        boat.setImages(new HashSet<>(images));
        boat.setUser(user);
        locationRepository.saveAndFlush(boat.getLocation());
        boatRepository.saveAndFlush(boat);
        return true;
    }

    public boolean updateBoat(Long id, AddNewBoatDTO dto, String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return false;
        }
        Boat boat = boatRepository.findById(id).orElse(null);
        if (boat == null || boat.isDeleted() || boat.getUser() == null
                || !boat.getUser().getId().equals(user.getId())) {
            return false;
        }
        if (offerService.hasActiveReservation(id)) {
            return false;
        }
        boat.setOfferName(dto.getOfferName());
        if (boat.getLocation() == null) {
            Location location = new Location(dto.getCountry(), dto.getCity(), dto.getStreet(), dto.getStreetNumber());
            location.setLongitude(dto.getLongitude());
            location.setLatitude(dto.getLatitude());
            boat.setLocation(location);
        } else {
            boat.getLocation().setCountry(dto.getCountry());
            boat.getLocation().setCity(dto.getCity());
            boat.getLocation().setStreet(dto.getStreet());
            boat.getLocation().setStreetNumber(dto.getStreetNumber());
            boat.getLocation().setLongitude(dto.getLongitude());
            boat.getLocation().setLatitude(dto.getLatitude());
        }
        boat.setDescription(dto.getDescription());
        boat.setUnitPrice(dto.getUnitPrice());
        boat.setMaxCustomerCapacity(dto.getMaxCustomerCapacity());
        boat.setRulesOfConduct(dto.getRulesOfConduct());
        boat.setCancellationPolicy(dto.getCancellationPolicy());
        boat.setBoatType(dto.getBoatType() == null || dto.getBoatType().isEmpty() ? "Boat" : dto.getBoatType());
        boat.setBoatLength(dto.getBoatLength() <= 0 ? 5.0 : dto.getBoatLength());
        if (dto.getAdditionalServices() != null) {
            boat.setAdditionalServices(new HashSet<>(dto.getAdditionalServices()));
        }
        if (boat.getEngine() == null) {
            Engine engine = new Engine();
            engine.setNumberOfEngines(dto.getNumberOfEngines() <= 0 ? 1 : dto.getNumberOfEngines());
            engine.setPower(dto.getPower() <= 0 ? 50 : dto.getPower());
            engine.setMaxSpeed(dto.getMaxSpeed() <= 0 ? 30 : dto.getMaxSpeed());
            engineRepository.saveAndFlush(engine);
            boat.setEngine(engine);
        } else {
            boat.getEngine().setNumberOfEngines(dto.getNumberOfEngines() <= 0 ? 1 : dto.getNumberOfEngines());
            boat.getEngine().setPower(dto.getPower() <= 0 ? 50 : dto.getPower());
            boat.getEngine().setMaxSpeed(dto.getMaxSpeed() <= 0 ? 30 : dto.getMaxSpeed());
            engineRepository.saveAndFlush(boat.getEngine());
        }
        locationRepository.saveAndFlush(boat.getLocation());
        boatRepository.saveAndFlush(boat);
        return true;
    }
}
