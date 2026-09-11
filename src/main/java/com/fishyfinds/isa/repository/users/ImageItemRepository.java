package com.fishyfinds.isa.repository.users;

import com.fishyfinds.isa.model.beans.offers.ImageItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageItemRepository extends JpaRepository<ImageItem, Long> {
}
