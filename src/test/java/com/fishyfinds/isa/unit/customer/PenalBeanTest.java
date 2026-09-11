package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PenalBeanTest {

    @Test
    void defaultPenalStartsAtZeroWhenSet() {
        Penal penal = new Penal();
        Customer customer = new Customer();
        customer.setEmail("customer@example.com");
        penal.setId(1L);
        penal.setCustomer(customer);
        penal.setNumber(0);

        assertEquals(1L, penal.getId());
        assertEquals("customer@example.com", penal.getCustomer().getEmail());
        assertEquals(0, penal.getNumber());
    }

    @Test
    void numberCanIncrease() {
        Penal penal = new Penal();
        penal.setNumber(2);
        penal.setNumber(penal.getNumber() + 1);
        assertEquals(3, penal.getNumber());
    }
}
