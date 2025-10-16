package com.lekhsewa.backend.services;

import com.lekhsewa.backend.model.AppUser;
import com.lekhsewa.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServices {

    private final AppUserRepository appUserRepository;

    public String lookUpUserPlan(String sub){
        Optional<AppUser> user = appUserRepository.findByAuth0Sub(sub);
        if (user.isPresent()) {
            return user.orElseThrow(() -> new RuntimeException("User not found")).getPlan();
        }
        return null;
    }
}
