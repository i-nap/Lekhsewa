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
        System.out.println("getUserPlan: "+sub);
        String planType = userServices.lookUpUserPlan(sub);
        System.out.println(planType);
        return ResponseEntity.ok(planType);
    }

    @GetMapping(path = "/changeplantopro")
    public ResponseEntity<String> changePlanToPro (@RequestParam ("sub") String sub){
        String planType = userServices.changePlantoPro(sub);
        return ResponseEntity.ok(planType);
    }

    @GetMapping(path = "/getuserquota")
    public ResponseEntity<String> getUserQuota(@RequestParam ("sub") String sub){
        Integer quota = userServices.lookupquota(sub);
        return  ResponseEntity.ok(String.valueOf(quota));
    }

}
