package com.fishyfinds.isa.repository.users;

import com.fishyfinds.isa.model.beans.users.customers.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.QueryHints;

import javax.persistence.LockModeType;
import javax.persistence.QueryHint;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value ="0")})
    public Customer findByEmail(String email);

    public Customer findByVerificationCode(String verificationCode);
}
