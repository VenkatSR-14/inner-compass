package com.innercompass.userservice.controller;

import com.innercompass.userservice.model.YogaClass;
import com.innercompass.userservice.service.YogaClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@CrossOrigin(origins = "*")
public class YogaClassController {

    private final YogaClassService yogaClassService;

    public YogaClassController(YogaClassService yogaClassService) {
        this.yogaClassService = yogaClassService;
    }

    @GetMapping
    public ResponseEntity<List<YogaClass>> getAllClasses() {
        return ResponseEntity.ok(yogaClassService.getAllClasses());
    }

    @GetMapping("/search")
    public ResponseEntity<List<YogaClass>> searchClasses(@RequestParam String q) {
        return ResponseEntity.ok(yogaClassService.searchClasses(q));
    }
}
