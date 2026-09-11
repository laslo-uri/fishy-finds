package com.fishyfinds.isa.integration.owners;

import com.fishyfinds.isa.model.beans.offers.courses.Course;
import com.fishyfinds.isa.model.beans.users.User;
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

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceFindAllByOwnerTest {

    @Mock CourseRepository courseRepository;
    @Mock OfferRepository offerRepository;
    @Mock LocationRepository locationRepository;
    @Mock UserRepository userRepository;
    @InjectMocks CourseService courseService;

    @Test
    void findAllByOwnerIdFiltersCourses() {
        User instructor = new User();
        instructor.setId(4L);
        Course mine = new Course();
        mine.setUser(instructor);
        Course other = new Course();
        User u2 = new User();
        u2.setId(8L);
        other.setUser(u2);
        when(courseRepository.findAll()).thenReturn(Arrays.asList(mine, other));

        List<Course> result = courseService.findAllByOwnerId(4L);
        assertEquals(1, result.size());
        assertSame(mine, result.get(0));
    }
}
