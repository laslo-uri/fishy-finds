package com.fishyfinds.isa.repository.offers;
import com.fishyfinds.isa.model.beans.offers.boats.Boat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoatRepository extends JpaRepository<Boat, Long> {

}
