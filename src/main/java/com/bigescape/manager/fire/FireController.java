package com.bigescape.manager.fire;

import com.bigescape.manager.fire.dto.FireResponse;
import com.bigescape.manager.fire.dto.FiresOfAllParticipants;
import com.bigescape.manager.user.Account;
import com.bigescape.manager.user.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/fires")
public class FireController {

    private final FireService fireService;
    private final AccountService accountService;

    public FireController(FireService fireService, AccountService accountService) {
        this.fireService = fireService;
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity getFiresOfAllParticipantsByDate(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        List<Account> accounts = accountService.findAll();

        Map<String, List<Fire>> mappedFires = fireService.getStartedListByFireDate(date).stream()
                .collect(Collectors.groupingBy(acc->acc.getAccount().getUsername()));

        FiresOfAllParticipants firesOfAllParticipants = FiresOfAllParticipants.builder()
                .accounts(accounts)
                .fires(mappedFires)
                .build();

        return ResponseEntity.ok(firesOfAllParticipants);
    }

    @PostMapping
    public ResponseEntity doFire(HttpSession session)  {
        Account loginUser = (Account) session.getAttribute("me");
        Fire lastFire = fireService.getLastFiredByName(loginUser.getUsername());

        FireType nextFireType = loginUser.getFireState().equals(FireType.START) ? FireType.END : FireType.START;
        loginUser.setFireState(nextFireType);

        if(lastFire != null && lastFire.getFireType().equals(nextFireType)) {
            return ResponseEntity.badRequest().build();
        }
        Fire fire = Fire.builder()
                .account(loginUser)
                .fireDate(lastFire == null || FireType.START.equals(nextFireType) ? LocalDate.now() : lastFire.getFireDate())
                .fireType(nextFireType)
                .fireTime(LocalDateTime.now())
                .build();

        Fire result = fireService.doFire(fire);

        if(FireType.END.equals(nextFireType)) {
            lastFire.setEnd(result);
            result = fireService.doFire(lastFire);
        }
        session.setAttribute("me", accountService.save(loginUser));

        return ResponseEntity.ok(FireResponse.builder()
                .fire(result)
                .owner(loginUser.getUsername())
                .build());
    }

    @GetMapping("/last")
    public ResponseEntity getLastFired(String username) {
        Fire lastFired = fireService.getLastFiredByName(username);

        return ResponseEntity.ok(lastFired);
    }
}
