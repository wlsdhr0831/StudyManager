package com.bigescape.manager.sync;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sync<T> {
    private String sender;
    private SyncType type;
    private T data;
}
