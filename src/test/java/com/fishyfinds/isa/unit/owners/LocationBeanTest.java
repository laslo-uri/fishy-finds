package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.model.beans.offers.Location;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LocationBeanTest {

    @Test
    void constructorSetsAddressFields() {
        Location location = new Location("Serbia", "Belgrade", "Knez Mihailova", "1");
        assertEquals("Serbia", location.getCountry());
        assertEquals("Belgrade", location.getCity());
        assertEquals("Knez Mihailova", location.getStreet());
        assertEquals("1", location.getStreetNumber());
        assertEquals(0, location.getLongitude());
        assertEquals(0, location.getLatitude());
    }

    @Test
    void coordinatesCanBeSet() {
        Location location = new Location();
        location.setLongitude(20.4);
        location.setLatitude(44.8);
        assertEquals(20.4, location.getLongitude());
        assertEquals(44.8, location.getLatitude());
    }
}
