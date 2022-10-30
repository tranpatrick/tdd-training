package com.hoaxify.hoaxify.user.dto;

import com.hoaxify.hoaxify.user.User;
import lombok.Data;

@Data
public class UserDto {

    private long id;

    private String username;

    private String displayName;

    private String image;

    public UserDto(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setDisplayName(user.getDisplayName());
        this.setImage(user.getImage());
    }

}
