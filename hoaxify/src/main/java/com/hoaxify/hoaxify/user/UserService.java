package com.hoaxify.hoaxify.user;

import com.hoaxify.hoaxify.error.NotFoundException;
import com.hoaxify.hoaxify.file.FileService;
import com.hoaxify.hoaxify.user.dto.UserUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    private FileService fileService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, FileService fileService) {
        super();
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Page<User> getUsers(User loggedInUser, Pageable pageable) {
        if (loggedInUser != null) {
            return userRepository.findByUsernameNot(loggedInUser.getUsername(), pageable);
        }
        return userRepository.findAll(pageable);
    }

    public User getByUsername(String username) {
        User userInDb = userRepository.findByUsername(username);
        if (userInDb == null) {
            throw new NotFoundException(username + " not found");
        }
        return userInDb;
    }

    public User update(long id, UserUpdateDto userUpdateDto) {
        Optional<User> userInDbOptional = userRepository.findById(id);
        userInDbOptional.orElseThrow(() -> {
            throw new NotFoundException(id + " not found");
        });
        User userInDb = userInDbOptional.get();
        userInDb.setDisplayName(userUpdateDto.getDisplayName());

        if (userUpdateDto.getImage() != null) {
            String savedImageName;
            try {
                savedImageName = fileService.saveProfileImage(userUpdateDto.getImage());
                fileService.deleteProfileImage(userInDb.getImage());
                userInDb.setImage(savedImageName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return userRepository.save(userInDb);
    }
}
