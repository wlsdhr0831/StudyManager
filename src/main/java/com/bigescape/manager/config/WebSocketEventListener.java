package com.bigescape.manager.config;

import com.bigescape.manager.fire.Fire;
import com.bigescape.manager.fire.FireService;
import com.bigescape.manager.fire.FireType;
import com.bigescape.manager.fire.dto.FireResponse;
import com.bigescape.manager.sync.Sync;
import com.bigescape.manager.user.AccountService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.data.util.Pair;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.text.Bidi;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final int AUTO_FINISH_TIMEOUT = 1000 * 60 * 5;
    private final FireService fireService;
    private final AccountService accountService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private Map<String, String> sessionIdMap = new HashMap<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sender = (String) ((List)((Map) ((GenericMessage) event.getMessage().getHeaders().get("simpConnectMessage")).getHeaders().get("nativeHeaders")).get("sender")).get(0);

        sessionIdMap.put(headerAccessor.getSessionId(), sender);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = sessionIdMap.get(headerAccessor.getSessionId());
        sessionIdMap.remove(headerAccessor.getSessionId());
        Fire lastFired = fireService.getLastFiredByName(username);

        if(lastFired != null && FireType.START.equals(lastFired.getFireType())) {
            ((Runnable) () -> {
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
                    FireResponse finish = fireService.doFire(accountService.findByUsername(username).orElseThrow());
                    simpMessagingTemplate.convertAndSend("/topic/fire/sync", Sync.builder().sender(finish.getOwner()).fire(finish.getFire()).build());
                }
            }).run();
        }
    }
}