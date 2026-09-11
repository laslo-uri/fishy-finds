package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.dto.RegistrationRequestDTO;
import com.fishyfinds.isa.model.enums.RegistrationStatus;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

class RegistrationRequestDTOTest {

    @Test
    void canConstructAndSetFieldsViaReflection() throws Exception {
        RegistrationRequestDTO dto = new RegistrationRequestDTO();
        set(dto, "firstName", "Ana");
        set(dto, "lastName", "Petrovic");
        set(dto, "email", "ana@example.com");
        set(dto, "registrationType", "CUSTOMER");
        set(dto, "registrationStatus", RegistrationStatus.WAITING_FOR_RESPONSE);

        assertEquals("Ana", get(dto, "firstName"));
        assertEquals("ana@example.com", get(dto, "email"));
        assertEquals(RegistrationStatus.WAITING_FOR_RESPONSE, get(dto, "registrationStatus"));
    }

    private static void set(Object target, String name, Object value) throws Exception {
        Field field = RegistrationRequestDTO.class.getDeclaredField(name);
        field.setAccessible(true);
        field.set(target, value);
    }

    private static Object get(Object target, String name) throws Exception {
        Field field = RegistrationRequestDTO.class.getDeclaredField(name);
        field.setAccessible(true);
        return field.get(target);
    }
}
