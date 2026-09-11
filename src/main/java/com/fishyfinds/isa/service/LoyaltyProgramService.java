package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.model.beans.users.instructors.Instructor;
import com.fishyfinds.isa.model.beans.users.owners.BoatOwner;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.users.BoatOwnerRepository;
import com.fishyfinds.isa.repository.users.CustomerRepository;
import com.fishyfinds.isa.repository.users.InstructorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LoyaltyProgramService {

    @Autowired
    private LoyaltyProgramRepository loyaltyProgramRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private BoatOwnerRepository boatOwnerRepostory;
    @Autowired
    private InstructorRepository instructorRepository;

    public void addNewLoyalty(Map<String, String> message) {
        LoyaltyProgram loyalty = new LoyaltyProgram();
        loyalty.setCategoryName(message.get("categoryName"));
        loyalty.setCategoryDiscount(Double.parseDouble(message.getOrDefault("categoryDiscount", "0")));
        loyalty.setEarningRate(Double.parseDouble(message.getOrDefault("earningRate", "0")));
        loyalty.setRequiredPoints(Integer.parseInt(message.getOrDefault("requiredPoints",
                message.getOrDefault("minPoints", "0"))));
        if (!checkIfExists(loyalty.getCategoryName())) {
            loyaltyProgramRepository.save(loyalty);
        }
    }

    private boolean checkIfExists(String category) {
        for (LoyaltyProgram program : loyaltyProgramRepository.findAll()) {
            if (category != null && category.equalsIgnoreCase(program.getCategoryName())) {
                return true;
            }
        }
        return false;
    }

    public void deleteLoyalty(Map<String, String> message) {
        LoyaltyProgram loyalty = loyaltyProgramRepository.findById(Integer.parseInt(message.get("id"))).orElse(null);
        if (loyalty != null) {
            loyaltyProgramRepository.delete(loyalty);
        }
    }

    public List<LoyaltyProgram> getAllLoyalties() {
        return loyaltyProgramRepository.findAll();
    }

    public boolean setLoyaltyToCustomer(Customer customer, LoyaltyProgram loyaltyProgram) {
        customer.setLoyaltyProgram(loyaltyProgram);
        customerRepository.save(customer);
        return true;
    }

    public boolean setLoyaltyToInstructor(Instructor instructor, LoyaltyProgram loyaltyProgram) {
        instructor.setLoyaltyProgram(loyaltyProgram);
        instructorRepository.save(instructor);
        return true;
    }

    public boolean setLoyaltyToOwner(BoatOwner owner, LoyaltyProgram loyaltyProgram) {
        owner.setLoyaltyProgram(loyaltyProgram);
        boatOwnerRepostory.save(owner);
        return true;
    }
}
