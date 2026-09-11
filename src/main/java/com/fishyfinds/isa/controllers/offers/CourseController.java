package com.fishyfinds.isa.controllers.offers;

import com.fishyfinds.isa.dto.AddNewCourseDTO;
import com.fishyfinds.isa.dto.OfferDTO;
import com.fishyfinds.isa.model.beans.Subscriber;
import com.fishyfinds.isa.model.beans.offers.ImageItem;
import com.fishyfinds.isa.model.beans.offers.courses.Course;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.SubscriberService;
import com.fishyfinds.isa.service.offers.CourseService;
import com.fishyfinds.isa.service.users.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class CourseController {

    @Autowired
    private CourseService courseService;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private SubscriberService subscriberService;
    @Autowired
    private UserService userService;

    @GetMapping("/allCourses")
    public List<OfferDTO> findAll(@RequestHeader(value = "Authorization", required = false) HttpHeaders header) {
        List<Course> courses = courseService.findAll();
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
        for (Course course : courses) {
            OfferDTO dto = new OfferDTO();
            dto.setOffer(course);
            dto.setPath(resolveFirstImage(course));
            for (Subscriber s : subscribers) {
                if (s.isRelevant() && s.getFollowing().getId().equals(course.getId())) {
                    dto.setFollowed(true);
                    break;
                }
            }
            retVal.add(dto);
        }
        return retVal;
    }

    @GetMapping("/allMyCourses")
    @PreAuthorize("hasRole('ROLE_INSTRUCTOR')")
    public List<Course> findAllByOwnerId(@RequestHeader("Authorization") HttpHeaders header) {
        try {
            final JSONObject obj = new JSONObject(header.getFirst(HttpHeaders.AUTHORIZATION));
            String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
            User owner = userService.findUserByEmail(username);
            return courseService.findAllByOwnerId(owner.getId());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PostMapping({"/addNewCourse", "/newCourse"})
    @PreAuthorize("hasRole('ROLE_INSTRUCTOR')")
    public boolean addNewCourse(@RequestHeader("Authorization") HttpHeaders header,
                                @RequestBody Map<String, Object> message) {
        try {
            final JSONObject obj = new JSONObject(header.getFirst(HttpHeaders.AUTHORIZATION));
            String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
            return courseService.addNewCourse(mapToCourseDto(message), username);
        } catch (Exception e) {
            return false;
        }
    }

    @PutMapping("/updateCourse/{id}")
    @PreAuthorize("hasRole('ROLE_INSTRUCTOR')")
    public boolean updateCourse(@RequestHeader("Authorization") HttpHeaders header,
                                @PathVariable Long id,
                                @RequestBody Map<String, Object> message) {
        try {
            final JSONObject obj = new JSONObject(header.getFirst(HttpHeaders.AUTHORIZATION));
            String username = tokenUtils.getUsernameFromToken(obj.getString("accessToken"));
            return courseService.updateCourse(id, mapToCourseDto(message), username);
        } catch (Exception e) {
            return false;
        }
    }

    private AddNewCourseDTO mapToCourseDto(Map<String, Object> message) {
        AddNewCourseDTO dto = new AddNewCourseDTO();
        dto.setOfferName(asString(message.get("offerName")));
        dto.setCountry(asString(message.get("country")));
        dto.setCity(asString(message.get("city")));
        dto.setStreet(asString(message.get("street")));
        dto.setStreetNumber(asString(message.get("streetNumber")));
        dto.setDescription(asString(message.get("description")));
        dto.setRulesOfConduct(asString(message.get("rulesOfConduct")));
        String cancellation = asString(message.get("cancellationPolicy"));
        dto.setCancellationPolicy(cancellation.isEmpty() ? "Standard cancellation" : cancellation);
        try {
            dto.setUnitPrice(Double.parseDouble(asString(message.get("unitPrice"), "0")));
        } catch (NumberFormatException e) {
            dto.setUnitPrice(0);
        }
        Object capacity = message.get("maxCustomerCapacity");
        if (capacity == null) {
            capacity = message.get("maxCapacity");
        }
        try {
            dto.setMaxCustomerCapacity(Integer.parseInt(asString(capacity, "1")));
        } catch (NumberFormatException e) {
            dto.setMaxCustomerCapacity(1);
        }
        return dto;
    }

    private String asString(Object value) {
        return asString(value, "");
    }

    private String asString(Object value, String defaultValue) {
        if (value == null) {
            return defaultValue;
        }
        String text = value.toString();
        return text.isEmpty() ? defaultValue : text;
    }

    private String resolveFirstImage(Course course) {
        if (course.getImages() == null || course.getImages().isEmpty()) {
            return "images/no-pictures.png";
        }
        Optional<ImageItem> first = course.getImages().stream()
                .filter(i -> "first".equals(i.getName()))
                .findFirst();
        return first.map(ImageItem::getPath).orElse(course.getImages().iterator().next().getPath());
    }
}
