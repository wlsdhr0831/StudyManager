package com.bigescape.manager.config;

import com.bigescape.manager.fire.FireType;
import com.bigescape.manager.user.Account;
import com.bigescape.manager.user.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class AppConfig {

    @Bean
    ApplicationRunner applicationRunner() {
        return new ApplicationRunner() {
            @Autowired
            AccountService accountService;

            @Override
            public void run(ApplicationArguments args) {
                Account[] participants = new Account[] {
                        Account.builder().username("정인균").userPw("1").fireState(FireType.END).build(),
                        Account.builder().username("조희진").userPw("1").fireState(FireType.END).build(),
                        Account.builder().username("성진옥").userPw("1").fireState(FireType.END).build(),
                        Account.builder().username("허인").userPw("1").fireState(FireType.END).build(),
                        Account.builder().username("노휘종").userPw("1").fireState(FireType.END).build()
                };

                for (Account participant : participants) {
                    if(accountService.findByUsername(participant.getUsername()).isEmpty()) {
                        accountService.save(participant);
                    }
                }
            }
        };
    }

}
