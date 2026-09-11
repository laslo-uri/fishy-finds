package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.PriceType;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PriceTypeTest {

    @Test
    void dailyAndHourlyExist() {
        assertEquals(PriceType.DAILY_PRICE, PriceType.valueOf("DAILY_PRICE"));
        assertEquals(PriceType.HOURLY_PRICE, PriceType.valueOf("HOURLY_PRICE"));
        assertEquals(2, PriceType.values().length);
    }
}
