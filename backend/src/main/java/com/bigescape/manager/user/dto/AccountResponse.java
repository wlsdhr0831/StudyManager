package com.bigescape.manager.user.dto;

import com.bigescape.manager.fire.FireType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccountResponse {
    private final String username;
    private final FireType fireState;
}
