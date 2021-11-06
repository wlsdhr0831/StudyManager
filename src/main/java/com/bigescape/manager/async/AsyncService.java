package com.bigescape.manager.async;

import com.bigescape.manager.fire.FireService;
import com.bigescape.manager.fire.dto.FireResponse;
import com.bigescape.manager.sync.Sync;
import com.bigescape.manager.sync.SyncType;
import com.bigescape.manager.user.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncService {
    private final int AUTO_FINISH_TIMEOUT = 1000 * 60 * 5;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final AccountService accountService;
    private final FireService fireService;

    @Async("threadPoolExecutor")
    public void checkLeave(Map<String, String> sessionIdMap, String username, LocalDateTime disconnectedTime) {
        long start = Timestamp.valueOf(disconnectedTime).getTime();
        boolean reconnected = false;

        while(System.currentTimeMillis() - start < AUTO_FINISH_TIMEOUT) {
            if(sessionIdMap.containsValue(username)) {
                log.info("{} 재연결 !", username);
                reconnected = true;
                break;
            }
            log.info("{}이 끊긴 지 {}초...", username, ((double)(System.currentTimeMillis()) - start) / 1000);

            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        if(!reconnected) {
            FireResponse finish = fireService.doFire(accountService.findByUsername(username).orElseThrow(), disconnectedTime);
            simpMessagingTemplate.convertAndSend("/topic/fire/sync",
                    Sync.builder()
                            .sender(finish.getOwner())
                            .type(SyncType.FIRED)
                            .data(finish.getFire())
                            .build());
            log.info("{} 강제 종료...", username);
        }
    }
}
