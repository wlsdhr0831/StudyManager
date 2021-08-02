package com.bigescape.manager.fire.dto;

import com.bigescape.manager.fire.Fire;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FireResponse {
    private final Fire fire;
    private final String owner;
}
