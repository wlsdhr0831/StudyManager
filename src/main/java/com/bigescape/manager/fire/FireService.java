package com.bigescape.manager.fire;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FireService {

    private final FireRepository fireRepository;

    public FireService(FireRepository fireRepository) {
        this.fireRepository = fireRepository;
    }

    public Fire doFire(Fire fire) {
        return fireRepository.save(fire);
    }

    public List<Fire> getStartedListByFireDate(LocalDate fireDate) {
        return fireRepository.findAllByFireDateAndFireType(fireDate, FireType.START);
    }

    public Fire getLastFiredByName(String username) {
        return fireRepository.findFirstByAccount_UsernameOrderByIdDesc(username);
    }
}
