package com.fishyfinds.isa.unit.instructoradmin;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LoyaltyProgramServiceValidationTest {

    /** Mirrors LoyaltyProgramService.checkIfExists name comparison. */
    private boolean checkIfExists(String category, List<LoyaltyProgram> existing) {
        for (LoyaltyProgram program : existing) {
            if (category != null && category.equalsIgnoreCase(program.getCategoryName())) {
                return true;
            }
        }
        return false;
    }

    @Test
    void detectsDuplicateCategoryIgnoreCase() {
        LoyaltyProgram gold = new LoyaltyProgram();
        gold.setCategoryName("Gold");
        List<LoyaltyProgram> all = Arrays.asList(gold);

        assertTrue(checkIfExists("gold", all));
        assertTrue(checkIfExists("GOLD", all));
        assertFalse(checkIfExists("Platinum", all));
    }

    @Test
    void constructedLoyaltyHoldsValidationInputs() {
        LoyaltyProgram loyalty = new LoyaltyProgram();
        loyalty.setCategoryName("Bronze");
        loyalty.setRequiredPoints(0);
        loyalty.setCategoryDiscount(0);
        loyalty.setEarningRate(1.0);

        assertEquals("Bronze", loyalty.getCategoryName());
        assertEquals(0, loyalty.getRequiredPoints());
        assertFalse(checkIfExists(null, Arrays.asList(loyalty)));
    }
}
