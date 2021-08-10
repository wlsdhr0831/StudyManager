package com.bigescape.manager.sync;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class SyncController {

    @MessageMapping("/fire/sync.register")
    public void registerSync(String sender) {
        log.info("Send From : {}", sender);
    }

    @MessageMapping("/fire/sync.send")
    @SendTo("/topic/fire/sync")
    public Sync sendSync(@Payload Sync sync) {
        log.info("Send From : {}", sync.getSender());
        return sync;
    }
}
