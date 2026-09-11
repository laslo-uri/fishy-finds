package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.dto.AddNewCourseDTO;
import com.fishyfinds.isa.repository.LocationRepository;
import com.fishyfinds.isa.repository.offers.CourseRepository;
import com.fishyfinds.isa.repository.offers.OfferRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.offers.CourseService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceAddNewCourseTest {

    @Mock CourseRepository courseRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @InjectMocks CourseService courseService;

    @Test
    void addNewCourseFailsWithoutUser() {
        when(userRepository.findByEmail("x@y.com")).thenReturn(null);
        assertFalse(courseService.addNewCourse(new AddNewCourseDTO(), "x@y.com"));
        verify(courseRepository, never()).saveAndFlush(any());
    }
}
