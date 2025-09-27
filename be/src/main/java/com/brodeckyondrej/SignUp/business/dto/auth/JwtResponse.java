package com.brodeckyondrej.SignUp.business.dto.auth;

import com.brodeckyondrej.SignUp.persistence.enumerated.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private UserRole role;

    public JwtResponse(String accessToken, Long id, String name, String email, UserRole role) {
        this.token = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}