package com.example.kin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kin.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}