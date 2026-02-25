package com.example.kin.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;

import com.example.kin.model.User;
import com.example.kin.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Simplified
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {
    String authorizedDomain = "@cit.edu"; // You can change this easily later

    // 1. Domain Validation
    if (!user.getEmail().toLowerCase().endsWith(authorizedDomain)) {
        return ResponseEntity.badRequest().body(Map.of(
            "message", "Unauthorized domain. Please register using an official institutional email address."
        ));
    }

    // 2. Duplicate Check
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of(
            "message", "The provided email address is already associated with an existing account."
        ));
    }

    // 3. Success Flow
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setRole("STUDENT");
    userRepository.save(user);
    
    return ResponseEntity.ok(Map.of(
        "message", "Account registration completed successfully."
    ));
}

   @PostMapping("/auth/login") // This path is /api/auth/login
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> user = userRepository.findByEmail(email);

            if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
                return ResponseEntity.ok(Map.of(
        "message", "Login successful",
        "username", user.get().getUsername(), // This key "username" is what React sees
        "role", user.get().getRole()
    ));
    
}
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @GetMapping("/user/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String token) {
        // Protected route placeholder
        return ResponseEntity.ok(Map.of("status", "Authenticated", "message", "Welcome back!"));
    }

        @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }


}