package com.hoaxify.hoaxify.user;

import com.fasterxml.jackson.annotation.JsonView;
import com.hoaxify.hoaxify.shared.CurrentUser;
import com.hoaxify.hoaxify.user.dto.UserDto;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @PostMapping("/api/v1.0/login")
    UserDto handleLogin(@CurrentUser User loggedInUser) {
        return new UserDto(loggedInUser);
    }

}
