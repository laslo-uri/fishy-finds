package com.fishyfinds.isa.integration.instructoradmin;

import com.fishyfinds.isa.model.beans.AccountDeletionRequest;
import com.fishyfinds.isa.model.enums.DeletionRequestStatus;
import com.fishyfinds.isa.repository.AccountDeletionRequestRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import com.fishyfinds.isa.service.AccountDeletionRequestService;
import com.fishyfinds.isa.service.MailService;
import com.fishyfinds.isa.service.users.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountDeletionRequestPendingTest {

    @Mock AccountDeletionRequestRepository accountDeletionRequestRepository;
    @Mock UserRepository userRepository;
    @Mock UserService userService;
    @Mock MailService mailService;
    @InjectMocks AccountDeletionRequestService accountDeletionRequestService;

    @Test
    void findAllPendingReturnsOnlyPending() {
        AccountDeletionRequest pending = new AccountDeletionRequest();
        pending.setStatus(DeletionRequestStatus.PENDING);
        AccountDeletionRequest accepted = new AccountDeletionRequest();
        accepted.setStatus(DeletionRequestStatus.ACCEPTED);
        when(accountDeletionRequestRepository.findAll()).thenReturn(Arrays.asList(pending, accepted));

        List<AccountDeletionRequest> result = accountDeletionRequestService.findAllPending();
        assertEquals(1, result.size());
        assertEquals(DeletionRequestStatus.PENDING, result.get(0).getStatus());
    }
}
