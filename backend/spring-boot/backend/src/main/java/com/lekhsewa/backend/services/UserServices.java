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

    public String changePlantoPro(String sub) {
        Optional<AppUser> userOpt = appUserRepository.findByAuth0Sub(sub);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found for sub: " + sub);
        }

        AppUser user = userOpt.get();
        user.setPlan("paid");

        appUserRepository.save(user);

        return "Plan upgraded to PRO";
    }

    public Boolean isUserAbleToProcessMoreImage(String sub) {
        System.out.println(sub);
        Optional<AppUser> userOpt = appUserRepository.findByAuth0Sub(sub);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found for sub: " + sub);
        }

        AppUser user = userOpt.get();
        if (user.getPlan().equals("paid")) {
            return true;
        }
        else if ( user.getPlan().equals("free") && user.getQuota() <= 5) {
            user.setQuota(user.getQuota() + 1);
            return true;
        }
        else {
            return false;
        }

    }

    public Integer lookupquota(String sub) {
        Optional<AppUser> userOpt = appUserRepository.findByAuth0Sub(sub);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found for sub: " + sub);
        }
        AppUser user = userOpt.get();
        return user.getQuota();
    }
}
