package com.fishyfinds.isa.unit.customer;

import com.fishyfinds.isa.model.enums.DeletionRequestStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DeletionRequestStatusTest {

    @Test
    void containsPendingAcceptedDeclinedAndCreationStates() {
        assertTrue(DeletionRequestStatus.values().length >= 7);
        assertNotNull(DeletionRequestStatus.PENDING);
        assertNotNull(DeletionRequestStatus.ACCEPTED);
        assertNotNull(DeletionRequestStatus.DECLINED);
        assertNotNull(DeletionRequestStatus.PENDING_CREATION);
        assertNotNull(DeletionRequestStatus.ACCEPTED_CREATION);
        assertNotNull(DeletionRequestStatus.DECLINED_CREATION);
        assertNotNull(DeletionRequestStatus.RESENT);
    }
}
