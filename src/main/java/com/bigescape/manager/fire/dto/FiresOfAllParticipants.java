package com.bigescape.manager.fire.dto;

import com.bigescape.manager.fire.Fire;
import com.bigescape.manager.user.Account;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Builder
@Getter
public class FiresOfAllParticipants {
    private final List<Account> accounts;
    private final Map<String, List<Fire>> fires;
}
