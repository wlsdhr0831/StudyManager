package com.bigescape.manager.fire;

import com.bigescape.manager.fire.dto.FireResponse;
import com.bigescape.manager.user.Account;
import com.bigescape.manager.util.DateAdjuster;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FireService {

    private final FireRepository fireRepository;

    public FireService(FireRepository fireRepository) {
        this.fireRepository = fireRepository;
    }

    public FireResponse doFire(Account loginUser) {
        Fire lastFire = fireRepository.findFirstByAccount_UsernameOrderByIdDesc(loginUser.getUsername());

        FireType nextFireType = lastFire == null ? FireType.START : lastFire.getFireType().next();

        Fire fire = Fire.builder()
                .account(loginUser)
                .fireDate(FireType.END.equals(nextFireType) ? lastFire.getFireDate() : DateAdjuster.officialToday())
                .fireType(nextFireType)
                .fireTime(LocalDateTime.now())
                .build();

        Fire result = fireRepository.save(fire);

        if(FireType.END.equals(nextFireType)) {
            lastFire.setEnd(result);
            result = fireRepository.save(lastFire);
        }

        return FireResponse.builder()
                .fire(result)
                .owner(loginUser.getUsername())
                .dayOver(FireType.END.equals(nextFireType) && result.getFireDate().isBefore(DateAdjuster.officialToday()))
                .build();
    }

    public List<Fire> getStartedListByFireDate(LocalDate fireDate) {
        return fireRepository.findAllByFireDateAndFireType(fireDate, FireType.START);
    }

    public List<Fire> getStartedListByFireDateAndUsername(String username, LocalDate fireDate) {
        return fireRepository.findAllByAccount_UsernameAndFireDateAndFireTypeOrderByIdAsc(username, fireDate, FireType.START);
    }

    public Fire getLastFiredByName(String username) {
        return fireRepository.findFirstByAccount_UsernameOrderByIdDesc(username);
    }
}
