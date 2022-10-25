package com.hoaxify.hoaxify.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Data // Constructor, getters, setters, equals, hashCode
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private long id;

    @NotNull(message = "{hoaxify.constraints.username.NotNull.message}")
    @Size(min = 4, max = 255)
    @UniqueUsername
    private String username;

    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;

    @NotNull
    @Size(min = 8, max = 255)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{hoaxify.constraints.password.Pattern.message}")
    private String password;

}
