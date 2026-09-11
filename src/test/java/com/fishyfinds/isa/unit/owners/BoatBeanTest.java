package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import com.fishyfinds.isa.model.beans.offers.boats.Engine;
import com.fishyfinds.isa.model.enums.OfferType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BoatBeanTest {

    @Test
    void boatExtendsOfferWithEngineFields() {
        Boat boat = new Boat();
        boat.setOfferName("Wave Rider");
        boat.setOfferType(OfferType.BOAT);
        boat.setBoatType("Speedboat");
        boat.setBoatLength(8.0);
        Engine engine = new Engine();
        engine.setPower(100);
        boat.setEngine(engine);

        assertEquals("Wave Rider", boat.getOfferName());
        assertEquals(OfferType.BOAT, boat.getOfferType());
        assertEquals("Speedboat", boat.getBoatType());
        assertEquals(8.0, boat.getBoatLength());
        assertEquals(100, boat.getEngine().getPower());
    }
}
