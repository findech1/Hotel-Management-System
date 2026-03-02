package com.hotel_management_system.backend.payload;

import java.util.Collection;

public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private Collection<?> authorities;

    public JwtResponse(String token, Long id, String username, Collection<?> authorities) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.authorities = authorities;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Collection<?> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<?> authorities) {
        this.authorities = authorities;
    }
}
