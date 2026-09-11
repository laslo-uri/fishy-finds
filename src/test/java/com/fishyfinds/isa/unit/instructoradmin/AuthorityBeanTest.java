package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.beans.users.Authority;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AuthorityBeanTest {

    @Test
    void grantedAuthorityReturnsName() {
        Authority authority = new Authority();
        authority.setId(1L);
        authority.setName("ROLE_ADMIN");

        assertEquals(1L, authority.getId());
        assertEquals("ROLE_ADMIN", authority.getName());
        assertEquals("ROLE_ADMIN", authority.getAuthority());
    }
}
