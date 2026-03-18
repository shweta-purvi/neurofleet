package com.neurofleetx.service;

import com.neurofleetx.model.User;
import com.neurofleetx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User userDetails) {
        User user = getCurrentUser();
        user.setFullName(userDetails.getFullName());
        user.setPhone(userDetails.getPhone());
        user.setLocation(userDetails.getLocation());
        return userRepository.save(user);
    }

    public User approveDriver(Long userId, boolean approved) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setDriverApproved(approved);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
