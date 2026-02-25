package com.example.kin

import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class AdminPanelActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_admin_panel)

        val btnBack = findViewById<Button>(R.id.btnBack)
        btnBack.setOnClickListener {
            finish() // Returns to the Dashboard
        }
    }
}