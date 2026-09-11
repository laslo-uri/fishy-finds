package com.fishyfinds.isa.repository.users;

import com.fishyfinds.isa.model.beans.users.owners.BungalowOwner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BungalowOwnerRepository extends JpaRepository<BungalowOwner, Long> {

public BungalowOwner findByEmail(String email);
}
