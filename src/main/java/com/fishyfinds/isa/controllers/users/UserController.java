package com.fishyfinds.isa.controllers.users;

import com.fishyfinds.isa.mappers.DtoToUser;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.service.AuthenticationService;
import com.fishyfinds.isa.service.users.CustomUserDetailsService;
import com.fishyfinds.isa.service.users.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping(value="/api", produces= MediaType.APPLICATION_JSON_VALUE)
public class UserController {
    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PutMapping("/changePassword")
    @PreAuthorize("hasRole('ROLE_COMMON')")
    public boolean changePassword(@RequestHeader("Authentication") HttpHeaders header, @RequestBody Map<String, String> message){
        final String value =header.getFirst(HttpHeaders.AUTHORIZATION);

        try {
            final JSONObject obj = new JSONObject(value);
            String user = obj.getString("accessToken");
            String username = tokenUtils.getUsernameFromToken(user);
            customUserDetailsService.changePassword(username,message.get("oldPassword"), message.get("newPassword"));
            return true;
        }catch(Exception e){
        }

        return false;
    }

    @PutMapping("/changeProfile")
    @PreAuthorize("hasRole('ROLE_COMMON')")
    public boolean changeProfile(@RequestBody Map<String,String> message, HttpServletRequest request){
        return userService.changeProfile(DtoToUser.MapToUser(message), request);
    }

    @GetMapping("/findUser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public User findUser(@Param("id") Long id){
        return userService.findUser(id);
    }

}
