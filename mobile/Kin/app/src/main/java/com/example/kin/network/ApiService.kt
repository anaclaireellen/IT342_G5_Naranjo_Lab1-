package com.example.kin.network

import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import com.example.kin.network.User
import com.example.kin.network.LoginResponse

interface ApiService {
    @POST("api/register")
    suspend fun register(@Body user: User): Response<ResponseBody>

    @POST("api/auth/login")
    suspend fun login(@Body credentials: Map<String, String>): Response<LoginResponse>
}

// Global constant for your local Spring Boot server
const val BASE_URL = "http://10.0.2.2:8080/"