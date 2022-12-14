package com.hoaxify.hoaxify.hoax;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hoaxify.hoaxify.user.User;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
@Entity
public class Hoax {

    @GeneratedValue
    @Id
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @NotNull
    @Size(min = 10, max = 5000)
    @Column(length = 5000)
    private String content;

    @ManyToOne
    private User user;

}
