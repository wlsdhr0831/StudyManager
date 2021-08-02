package com.bigescape.manager.user;

import com.bigescape.manager.fire.FireType;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Getter @Setter
@Builder
@ToString
@DynamicInsert
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    private String username;
    @Column(nullable = false)
    private String userPw;

    @Column(nullable = false)
    @ColumnDefault("'END'")
    @Enumerated(EnumType.STRING)
    private FireType fireState;
}
