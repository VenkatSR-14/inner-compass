package com.innercompass.userservice.service;

import com.innercompass.userservice.model.YogaClass;
import com.innercompass.userservice.repository.YogaClassRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class YogaClassServiceImpl implements YogaClassService {

    private final YogaClassRepository yogaClassRepository;

    public YogaClassServiceImpl(YogaClassRepository yogaClassRepository) {
        this.yogaClassRepository = yogaClassRepository;
    }

    @Override
    public List<YogaClass> getAllClasses() {
        return yogaClassRepository.findAll();
    }

    @Override
    public List<YogaClass> searchClasses(String keyword) {
        return yogaClassRepository.searchByKeyword(keyword);
    }
}
