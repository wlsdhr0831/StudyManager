package com.bigescape.manager.user;

import com.bigescape.manager.fire.FireType;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter @Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Account implements Serializable {
    @Id
    private String username;
    @Column(nullable = false)
    private String userPw;

    @Column(nullable = false)
    @ColumnDefault("'END'")
    @Enumerated(EnumType.STRING)
    private FireType fireState;
}
