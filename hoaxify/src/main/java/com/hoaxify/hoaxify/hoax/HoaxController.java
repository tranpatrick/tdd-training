package com.hoaxify.hoaxify.hoax;

import com.hoaxify.hoaxify.shared.CurrentUser;
import com.hoaxify.hoaxify.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1.0")
public class HoaxController {

    @Autowired
    HoaxService hoaxService;

    @PostMapping("/hoaxes")
    HoaxDto createHoax(@RequestBody @Valid Hoax hoax, @CurrentUser User user) {
        return new HoaxDto(hoaxService.save(user, hoax));
    }

    @GetMapping("/hoaxes")
    Page<HoaxDto> getAllHoaxes(Pageable pageable) {
        return hoaxService.getAllHoaxes(pageable).map(HoaxDto::new);
    }

    @GetMapping("/users/{username}/hoaxes")
    Page<HoaxDto> getHoaxesOfUser(@PathVariable String username, Pageable pageable) {
        return hoaxService.getHoaxesOfUser(username, pageable).map(HoaxDto::new);
    }

}
