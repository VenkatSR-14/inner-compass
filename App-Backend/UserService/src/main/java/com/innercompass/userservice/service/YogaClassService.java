package com.innercompass.userservice.service;

import com.innercompass.userservice.model.YogaClass;
import java.util.List;

public interface YogaClassService {
    List<YogaClass> getAllClasses();
    List<YogaClass> searchClasses(String keyword);
}
