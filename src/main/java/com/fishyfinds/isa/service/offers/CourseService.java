package com.fishyfinds.isa.service.offers;

import com.fishyfinds.isa.dto.AddNewCourseDTO;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.Location;
import com.fishyfinds.isa.model.beans.offers.courses.Course;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.OfferType;
import com.fishyfinds.isa.repository.LocationRepository;
import com.fishyfinds.isa.repository.offers.CourseRepository;
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
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OfferService offerService;

    @Cacheable("allCourses")
    public List<Course> findAll() {
        List<Course> all = courseRepository.findAll();
        List<Course> active = new ArrayList<>();
        for (Course course : all) {
            if (!course.isDeleted()) {
                active.add(course);
            }
        }
        return active;
    }

    public List<Course> findAllByOwnerId(Long ownerId) {
        List<Course> mine = new ArrayList<>();
        for (Course course : courseRepository.findAll()) {
            if (!course.isDeleted() && course.getUser() != null && course.getUser().getId().equals(ownerId)) {
                mine.add(course);
            }
        }
        return mine;
    }

    public boolean addNewCourse(AddNewCourseDTO dto, String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return false;
        }
        Course course = new Course();
        course.setOfferType(OfferType.COURSE);
        course.setOfferName(dto.getOfferName());
        Location location = new Location(dto.getCountry(), dto.getCity(), dto.getStreet(), dto.getStreetNumber());
        course.setLocation(location);
        course.setDescription(dto.getDescription());
        course.setUnitPrice(dto.getUnitPrice());
        course.setMaxCustomerCapacity(dto.getMaxCustomerCapacity());
        course.setRulesOfConduct(dto.getRulesOfConduct());
        course.setCancellationPolicy(dto.getCancellationPolicy());
        if (dto.getAdditionalServices() != null) {
            course.setAdditionalServices(new HashSet<>(dto.getAdditionalServices()));
        }

        ArrayList<ImageItem> images = new ArrayList<>();
        try {
            if (dto.getImage() != null) {
                for (int i = 0; i < dto.getImage().size(); ++i) {
                    if (dto.getImage().get(i) != null) {
                        String imageName = "course_" + (offerRepository.findAll().size() + 1) + "_" + i + "_";
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
        course.setImages(new HashSet<>(images));
        course.setUser(user);
        locationRepository.saveAndFlush(course.getLocation());
        courseRepository.saveAndFlush(course);
        return true;
    }

    public boolean updateCourse(Long id, AddNewCourseDTO dto, String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return false;
        }
        Course course = courseRepository.findById(id).orElse(null);
        if (course == null || course.isDeleted() || course.getUser() == null
                || !course.getUser().getId().equals(user.getId())) {
            return false;
        }
        if (offerService.hasActiveReservation(id)) {
            return false;
        }
        course.setOfferName(dto.getOfferName());
        if (course.getLocation() == null) {
            course.setLocation(new Location(dto.getCountry(), dto.getCity(), dto.getStreet(), dto.getStreetNumber()));
        } else {
            course.getLocation().setCountry(dto.getCountry());
            course.getLocation().setCity(dto.getCity());
            course.getLocation().setStreet(dto.getStreet());
            course.getLocation().setStreetNumber(dto.getStreetNumber());
        }
        course.setDescription(dto.getDescription());
        course.setUnitPrice(dto.getUnitPrice());
        course.setMaxCustomerCapacity(dto.getMaxCustomerCapacity());
        course.setRulesOfConduct(dto.getRulesOfConduct());
        course.setCancellationPolicy(dto.getCancellationPolicy());
        if (dto.getAdditionalServices() != null) {
            course.setAdditionalServices(new HashSet<>(dto.getAdditionalServices()));
        }
        locationRepository.saveAndFlush(course.getLocation());
        courseRepository.saveAndFlush(course);
        return true;
    }
}
