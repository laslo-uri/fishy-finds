package com.fishyfinds.isa.repository.users;
import com.fishyfinds.isa.model.beans.users.owners.BoatOwner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoatOwnerRepository extends JpaRepository<BoatOwner, Long> {

    public BoatOwner findByEmail(String email);
}
