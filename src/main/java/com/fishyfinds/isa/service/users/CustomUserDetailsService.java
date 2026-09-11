package com.fishyfinds.isa.service.users;

import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.repository.users.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    protected final Log LOGGER = LogFactory.getLog(getClass());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("No user found with username '%s'.", email));
        } else {
            return user;
        }
    }

    public boolean changePassword(String username, String oldPassword, String newPassword){
        if(oldPassword.equals(newPassword)){
            return false;
        }

        User user = userRepository.findByEmail(username);
        user.setPassword(passwordEncoder.encode(newPassword));
        Date date = new Date();
        user.setLastPasswordResetDate(new Timestamp(date.getTime()));
        user.setNumberOfLogIns(1);
        userRepository.save(user);
        return true;
    }

}
