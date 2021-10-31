package com.bigescape.manager.config;

import com.bigescape.manager.async.AsyncService;
import com.bigescape.manager.fire.Fire;
import com.bigescape.manager.fire.FireService;
import com.bigescape.manager.fire.FireType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final FireService fireService;
    private final AsyncService asyncService;

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
            asyncService.checkLeave(sessionIdMap, username);
        }
    }
}