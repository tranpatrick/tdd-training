package com.hoaxify.hoaxify.user.dto;

import com.hoaxify.hoaxify.shared.ProfileImage;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class UserUpdateDto {

    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;

    @ProfileImage
    private String image;

}
