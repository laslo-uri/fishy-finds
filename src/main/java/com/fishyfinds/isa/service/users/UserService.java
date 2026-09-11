package com.fishyfinds.isa.service.users;

import com.fishyfinds.isa.model.beans.users.Admin;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.UserType;
import com.fishyfinds.isa.repository.users.AdminRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private AdminRepository adminRepository;

    public boolean changePassword(Map<String, String> password){
        boolean retVal = false;
        User user = userRepository.findById(Long.valueOf(password.get("id"))).orElse(null);
        if(user != null){
            user.setPassword(password.get("newPassword"));
            if(user.getUserType() == UserType.ADMIN){

                user.setNumberOfLogIns(1);

            }
            userRepository.save(user);
            retVal = true;
        }
        return retVal;
    }

    public boolean changeProfile(User updatedUser, HttpServletRequest request) {
        boolean retVal = false;
        User user = userRepository.findById(updatedUser.getId()).orElse(null);
        if(user != null){
            user.update(updatedUser);
            userRepository.save(user);
            request.getSession().setAttribute("user", user);
            retVal = true;
        }
        return retVal;
    }

    public User findUser(Long id){
        return userRepository.findById(id).orElse(null);
    }

    public User findUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public boolean deleteUser(Long id){

        User user = userRepository.findById(id).orElse(null);

        if(user==null){
            return false;
        }
        else{
            user.setDeleted(true);
            userRepository.save(user);
            return true;
        }
    }


    public boolean activateUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if(user==null){
            return false;
        }
        else{
            user.setActivated(true);
            userRepository.save(user);
            return true;
        }
    }
}
