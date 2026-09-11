package com.fishyfinds.isa.service;

import com.fishyfinds.isa.mappers.DtoToUser;
import com.fishyfinds.isa.model.beans.AccountDeletionRequest;
import com.fishyfinds.isa.model.beans.LoyaltyProgram;
import com.fishyfinds.isa.model.beans.users.Admin;
import com.fishyfinds.isa.model.beans.users.Authority;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.model.beans.users.instructors.Instructor;
import com.fishyfinds.isa.model.beans.users.owners.BoatOwner;
import com.fishyfinds.isa.model.beans.users.owners.BungalowOwner;
import com.fishyfinds.isa.model.enums.UserType;
import com.fishyfinds.isa.repository.LoyaltyProgramRepository;
import com.fishyfinds.isa.repository.users.*;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class RegistrationService {

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private BoatOwnerRepository boatOwnerRepository;
    @Autowired
    private BungalowOwnerRepository bungalowOwnerRepository;
    @Autowired
    private InstructorRepository instructorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MailService mailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private AccountDeletionRequestService accountDeletionRequestService;
    @Autowired
    private PenalService penalService;
    @Autowired
    private AuthorityRepository authorityRepository;
    @Autowired
    private LoyaltyProgramRepository lpRepo;

    public boolean registerUser(Map<String, String> map, String siteURL){
        boolean successfullyRegistered = true;
        UserType userType = UserType.valueOf(map.get("userType"));
        switch (userType) {
            case CUSTOMER:
                successfullyRegistered = registerCustomer(DtoToUser.MapToCustomer(map), siteURL);
                break;
            case BUNGALOW_OWNER:
                successfullyRegistered = registerBungalowOwner(DtoToUser.MapToBungalowOwner(map), siteURL);
                break;
            case BOAT_OWNER:
                successfullyRegistered = registerBoatOwner(DtoToUser.MapToBoatOwner(map), siteURL);
                break;
            case INSTRUCTOR:
                successfullyRegistered = registerInstructor(DtoToUser.MapToInstructor(map), siteURL);
                break;
            case ADMIN:
                successfullyRegistered = registerAdmin(DtoToUser.MapToAdmin(map), siteURL);
                break;
        }
        return successfullyRegistered;
    }

    private boolean registerCustomer(Customer customer, String siteURL){
        boolean successfullyRegistered = true;
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        Date date = new Date();
        customer.setLastPasswordResetDate(new Timestamp(date.getTime()));
        if(!checkIfEmailExists(customer.getEmail())){
            customer.setUserType(UserType.CUSTOMER);
            customer.setNumberOfLogIns(0);
            setVerificationCode(RandomString.make(64), customer);
            try {
                mailService.sendVerificationEmail(customer, siteURL);
                List<Authority> auth = new ArrayList<>();
                auth.add(authorityRepository.findByName("ROLE_CUSTOMER"));
                auth.add(authorityRepository.findByName("ROLE_COMMON"));
                customer.setAuthorities(auth);
                customer.setLoyaltyProgram(lpRepo.findById(1).orElse(null));
                customerRepository.save(customer);
            } catch (Exception e) {
                successfullyRegistered = false;
            }
        }else{
            successfullyRegistered = false;
        }
        return successfullyRegistered;
    }

    public boolean registerBungalowOwner(BungalowOwner owner, String siteURL){
        boolean successfullyRegistered = false;
        if(!checkIfEmailExists(owner.getEmail())){
            owner.setUserType(UserType.BUNGALOW_OWNER);
            owner.setNumberOfLogIns(0);
            accountDeletionRequestService.addCreationRequest(owner.getEmail(), owner.getReasoning());
            //activateAccount(owner);
            bungalowOwnerRepository.save(owner);
            successfullyRegistered = true;
        }
        return successfullyRegistered;
    }

    public boolean registerBoatOwner(BoatOwner owner, String siteURL){
        boolean successfullyRegistered = false;
        if(!checkIfEmailExists(owner.getEmail())){
            owner.setUserType(UserType.BOAT_OWNER);
            owner.setNumberOfLogIns(0);
            accountDeletionRequestService.addCreationRequest(owner.getEmail(), owner.getReasoning());
            //activateAccount(owner);
            boatOwnerRepository.save(owner);
            successfullyRegistered = true;
        }
        return successfullyRegistered;
    }

    public boolean registerInstructor(Instructor instructor, String siteURL){
        boolean successfullyRegistered = false;
        instructor.setPassword(passwordEncoder.encode(instructor.getPassword()));
        if(!checkIfEmailExists(instructor.getEmail())){
            instructor.setUserType(UserType.INSTRUCTOR);
            instructor.setNumberOfLogIns(0);
            accountDeletionRequestService.addCreationRequest(instructor.getEmail(), instructor.getReasoning());
            //activateAccount(instructor);
            instructorRepository.save(instructor);
            successfullyRegistered = true;
        }
        return successfullyRegistered;
    }

    public boolean registerAdmin(Admin admin, String siteURL){
        boolean successfullyRegistered = true;
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        if(!checkIfEmailExists(admin.getEmail())){
            admin.setUserType(UserType.ADMIN);
            admin.setNumberOfLogIns(0);
            try {
                activateAccount(admin);
                adminRepository.save(admin);
            } catch (Exception e) {
                successfullyRegistered = false;
            }
        }
        return successfullyRegistered;
    }


    private boolean checkIfEmailExists(String email){
        return userRepository.findByEmail(email) != null;
    }


    public boolean verifyCustomerAccount(String verificationCode) {
        Customer user = customerRepository.findByVerificationCode(verificationCode);
        boolean retVal= user == null || user.isActivated() ? false : activateAccount(user);
        if(retVal)
            penalService.addNewPenal(user);

        return retVal;
    }

    private boolean activateAccount(User user){
        user.setActivated(true);
        setVerificationCode("", user);
        userRepository.save(user);
        return true;
    }

    private void setVerificationCode(String code, User user){
        user.setVerificationCode(code);
    }

}
