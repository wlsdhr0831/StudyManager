package com.bigescape.manager.sync;

import com.bigescape.manager.fire.Fire;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sync {
    private String sender;
    private Fire fire;
}
