package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.beans.offers.courses.Course;
import com.fishyfinds.isa.model.enums.OfferType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CourseBeanTest {

    @Test
    void courseIsOfferWithCourseType() {
        Course course = new Course();
        course.setOfferName("Fly Fishing 101");
        course.setOfferType(OfferType.COURSE);
        course.setDescription("Beginner course");
        course.setUnitPrice(50);
        course.setMaxCustomerCapacity(8);

        assertEquals("Fly Fishing 101", course.getOfferName());
        assertEquals(OfferType.COURSE, course.getOfferType());
        assertEquals(8, course.getMaxCustomerCapacity());
        assertEquals(50, course.getUnitPrice());
    }
}
