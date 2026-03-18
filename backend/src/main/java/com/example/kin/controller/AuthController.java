package com.example.kin.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.kin.model.User;
import com.example.kin.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String authorizedDomain = "@cit.edu";

        if (user.getEmail() == null || !user.getEmail().toLowerCase().endsWith(authorizedDomain)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Use @cit.edu email."));
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists."));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole("STUDENT");
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Registered successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "email", user.getEmail(),
                    "profilePic", user.getProfilePic() != null ? user.getProfilePic() : ""
                ));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> getProfiles(@RequestParam(required = false) List<String> usernames) {
        if (usernames == null || usernames.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(
            userRepository.findByUsernameIn(usernames).stream().map(user -> Map.of(
                "username", user.getUsername(),
                "profilePic", user.getProfilePic() != null ? user.getProfilePic() : "",
                "role", user.getRole() != null ? user.getRole() : ""
            )).collect(Collectors.toList())
        );
    }

    @PutMapping("/user/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        String email = updates.get("email");
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        String currentPassword = updates.get("currentPassword");
        if (currentPassword == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Incorrect current password. Identity not verified."));
        }

        if (updates.containsKey("username")) {
            String newUsername = updates.get("username");
            if (!newUsername.equals(user.getUsername())) {
                if (userRepository.existsByUsername(newUsername)) {
                    return ResponseEntity.status(400).body(Map.of("message", "Username '" + newUsername + "' is already taken."));
                }
                user.setUsername(newUsername);
            }
        }

        if (updates.containsKey("profilePic")) {
            user.setProfilePic(updates.get("profilePic"));
        }

        String newPassword = updates.get("newPassword");
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
    }
}
