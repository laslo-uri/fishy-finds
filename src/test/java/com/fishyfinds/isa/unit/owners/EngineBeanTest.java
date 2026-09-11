package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.model.beans.offers.boats.Engine;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EngineBeanTest {

    @Test
    void engineProperties() {
        Engine engine = new Engine();
        engine.setId(5L);
        engine.setNumberOfEngines(2);
        engine.setPower(150.5);
        engine.setMaxSpeed(40.0);

        assertEquals(5L, engine.getId());
        assertEquals(2, engine.getNumberOfEngines());
        assertEquals(150.5, engine.getPower());
        assertEquals(40.0, engine.getMaxSpeed());
    }
}
