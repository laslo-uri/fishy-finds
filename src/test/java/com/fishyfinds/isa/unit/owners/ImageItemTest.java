package com.fishyfinds.isa.unit.owners;

import com.fishyfinds.isa.model.beans.offers.ImageItem;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ImageItemTest {

    @Test
    void constructorSetsFields() {
        ImageItem item = new ImageItem("first", "images/bungalow_1.jpg", false);
        assertEquals("first", item.getName());
        assertEquals("images/bungalow_1.jpg", item.getPath());
        assertFalse(item.isDeleted());
    }

    @Test
    void softDeleteFlag() {
        ImageItem item = new ImageItem();
        item.setName("second");
        item.setDeleted(true);
        assertTrue(item.isDeleted());
        assertEquals("second", item.getName());
    }
}
