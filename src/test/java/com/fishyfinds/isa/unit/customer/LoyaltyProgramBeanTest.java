package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoyaltyProgramBeanTest {

    @Test
    void gettersAndSettersWork() {
        LoyaltyProgram loyalty = new LoyaltyProgram();
        loyalty.setId(2);
        loyalty.setCategoryName("Silver");
        loyalty.setRequiredPoints(50);
        loyalty.setCategoryDiscount(10.0);
        loyalty.setEarningRate(1.5);

        assertEquals(2, loyalty.getId());
        assertEquals("Silver", loyalty.getCategoryName());
        assertEquals(50, loyalty.getRequiredPoints());
        assertEquals(10.0, loyalty.getCategoryDiscount());
        assertEquals(1.5, loyalty.getEarningRate());
    }
}
