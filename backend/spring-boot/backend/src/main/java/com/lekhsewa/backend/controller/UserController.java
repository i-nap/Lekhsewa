package com.lekhsewa.backend.controller;

import com.lekhsewa.backend.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserServices  userServices;


    @GetMapping(path = "/getuserplan")
    public ResponseEntity<String> getUserPlan (@RequestParam ("sub") String sub){
        String planType = userServices.lookUpUserPlan(sub);
        return ResponseEntity.ok(planType);
    }

}
