package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    public boolean signIn(Map<String, String> credentials, HttpServletRequest request, HttpSession session) {
        boolean retVal = false;
        User user = userRepository.findByEmail(credentials.get("email"));
        if(user != null && user.isActivated() && checkPassword(user.getPassword(), credentials.get("password"))){
            retVal = true;
            session.invalidate();
            HttpSession newSession = request.getSession();
            newSession.setAttribute("user", user);
        }
        return retVal;
    }

    @Transactional
    public User authenticateUser(String username){
        try{
            return userRepository.findByEmail(username);
        }catch (Exception e){
        }
        return null;
    }

    private boolean checkPassword(String userPassword,String enteredPassword){
        return userPassword.equals(enteredPassword);
    }
}
