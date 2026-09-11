package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.beans.users.Admin;
import com.fishyfinds.isa.model.enums.UserType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdminBeanTest {

    @Test
    void constructorSetsProfileFields() {
        Admin admin = new Admin("Marko", "Jandric", "Street 1", "NS", "RS",
                "061000000", "admin@fishy.com", "secret");
        admin.setEarningPercentage(5.0);
        admin.setUserType(UserType.ADMIN);

        assertEquals("Marko", admin.getFirstName());
        assertEquals("Jandric", admin.getLastName());
        assertEquals("admin@fishy.com", admin.getEmail());
        assertEquals(5.0, admin.getEarningPercentage());
        assertEquals(UserType.ADMIN, admin.getUserType());
    }
}
