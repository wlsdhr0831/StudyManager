package com.bigescape.manager.fire;

import com.bigescape.manager.util.DateAdjuster;
import com.bigescape.manager.fire.dto.FireResponse;
import com.bigescape.manager.fire.dto.FiresOfAllParticipants;
import com.bigescape.manager.user.Account;
import com.bigescape.manager.user.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.datetime.standard.DateTimeFormatterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.nio.file.Path;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
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

    @GetMapping("/{username}")
    public ResponseEntity getFiresByUsernameAndDate(
            @PathVariable String username,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date
    ){
        return ResponseEntity.ok(fireService.getStartedListByFireDateAndUsername(username, date));
    }

    @PostMapping
    public ResponseEntity doFire(@RequestParam Date now, HttpSession session)  {
        Account loginUser = (Account) session.getAttribute("me");
        if(loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(fireService.doFire(loginUser, new Timestamp(now.getTime()).toLocalDateTime()));
    }

    @GetMapping("/last")
    public ResponseEntity getLastFired(String username) {
        Fire lastFired = fireService.getLastFiredByName(username);

        return ResponseEntity.ok(lastFired);
    }
}
