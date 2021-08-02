package com.bigescape.manager.fire;

import com.bigescape.manager.user.Account;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Fire {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private LocalDate fireDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FireType fireType;

    @Column(nullable = false)
    private LocalDateTime fireTime;

    @JsonIgnore
    @ManyToOne(targetEntity = Account.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "username")
    private Account account;

    @OneToOne(targetEntity = Fire.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "end_id")
    private Fire end;
}
