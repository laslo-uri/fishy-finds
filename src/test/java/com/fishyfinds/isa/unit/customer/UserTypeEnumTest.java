package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.UserType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTypeEnumTest {

    @Test
    void containsAllRoles() {
        assertEquals(5, UserType.values().length);
        assertEquals(UserType.CUSTOMER, UserType.values()[0]);
        assertEquals(UserType.BUNGALOW_OWNER, UserType.values()[1]);
        assertEquals(UserType.BOAT_OWNER, UserType.values()[2]);
        assertEquals(UserType.INSTRUCTOR, UserType.values()[3]);
        assertEquals(UserType.ADMIN, UserType.values()[4]);
    }
}
