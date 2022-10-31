package com.hoaxify.hoaxify.user;

import com.hoaxify.hoaxify.error.ApiError;
import com.hoaxify.hoaxify.shared.CurrentUser;
import com.hoaxify.hoaxify.shared.GenericResponse;
import com.hoaxify.hoaxify.user.dto.UserDto;
import com.hoaxify.hoaxify.user.dto.UserUpdateDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1.0/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    GenericResponse createUser(@Valid @RequestBody User user) {
        userService.save(user);
        return new GenericResponse("User saved");
    }

    @GetMapping
    Page<UserDto> getUsers(
            @CurrentUser User loggedInUser,
            Pageable pageable
    ) {
        return userService.getUsers(loggedInUser, pageable).map(UserDto::new);
    }

    @GetMapping("/{username}")
    UserDto getUserByName(@PathVariable String username) {
        return new UserDto(userService.getByUsername(username));
    }

    @PutMapping("/{id:[0-9]+}")
    @PreAuthorize("#id == principal.id")
    UserDto updateUser(@PathVariable long id, @RequestBody(required = false) UserUpdateDto userUpdateDto) {
        User userInDb = userService.update(id, userUpdateDto);
        return new UserDto(userInDb);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiError handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        ApiError apiError = new ApiError(400, "Validation error", request.getServletPath());
        BindingResult bindingResult = exception.getBindingResult();
        Map<String, String> validationErrors = new HashMap<>();

        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        apiError.setValidationErrors(validationErrors);
        return apiError;
    }

}
