package com.example.kin

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.kin.network.RetrofitClient
import com.example.kin.network.User
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // 1. Initialize UI Elements
        val etUsername = findViewById<EditText>(R.id.etRegUsername)
        val etEmail = findViewById<EditText>(R.id.etRegEmail)
        val etPassword = findViewById<EditText>(R.id.etRegPassword)
        val spnRole = findViewById<Spinner>(R.id.spnRole)
        val btnRegister = findViewById<Button>(R.id.btnRegister)

        // 2. Setup the Role Dropdown (Spinner)
        val roles = arrayOf("STUDENT", "ADMIN")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, roles)
        spnRole.adapter = adapter

        // 3. Handle Registration Click
        btnRegister.setOnClickListener {
            val username = etUsername.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            val role = spnRole.selectedItem.toString()

            // Basic validation
            if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Create User object matching your Models.kt
            val newUser = User(
                username = username,
                email = email,
                password = password,
                role = role
            )

            // 4. Send to Backend via Retrofit
            lifecycleScope.launch {
                try {
                    val response = RetrofitClient.instance.register(newUser)
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegisterActivity, "Account Created!", Toast.LENGTH_SHORT).show()
                        finish() // Returns user to Login screen
                    } else {
                        Toast.makeText(this@RegisterActivity, "Registration failed: Email might exist", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@RegisterActivity, "Error: Could not reach server", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}