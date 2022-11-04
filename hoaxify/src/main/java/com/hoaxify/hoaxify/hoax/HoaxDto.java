package com.hoaxify.hoaxify.hoax;

import com.hoaxify.hoaxify.user.dto.UserDto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HoaxDto {

    private long id;

    private long date;

    private String content;

    private UserDto user;

    public HoaxDto(Hoax hoax) {
        this.setId(hoax.getId());
        this.setContent(hoax.getContent());
        this.setDate(hoax.getTimestamp().getTime());
        this.setUser(new UserDto(hoax.getUser()));
    }

}
