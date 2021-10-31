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

//    @Async("threadPoolExecutor")
//    public void echoTime() {
//        while(true) {
//            LocalDateTime now = LocalDateTime.now();
//            simpMessagingTemplate.convertAndSend("/topic/fire/sync",
//                    Sync.builder()
//                            .sender("ADMIN")
//                            .type(SyncType.TIME)
//                            .data(now)
//                            .build()
//            );
//
//            log.info("Echo Now TIME :: {}", now);
//
//            try {
//                Thread.sleep(1000);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//        }
//    }

    @Async("threadPoolExecutor")
    public void checkLeave(Map<String, String> sessionIdMap, String username) {
        long start = System.currentTimeMillis();
        boolean reconnected = false;
        while(System.currentTimeMillis() - start < AUTO_FINISH_TIMEOUT) {
            if(sessionIdMap.containsValue(username)) {
                reconnected = true;
                break;
            }
            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        if(!reconnected) {
            FireResponse finish = fireService.doFire(accountService.findByUsername(username).orElseThrow(), LocalDateTime.now());
            simpMessagingTemplate.convertAndSend("/topic/fire/sync",
                    Sync.builder()
                            .sender(finish.getOwner())
                            .type(SyncType.FIRED)
                            .data(finish.getFire())
                            .build());
        }
    }
}
