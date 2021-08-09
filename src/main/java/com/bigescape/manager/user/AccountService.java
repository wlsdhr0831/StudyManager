package com.bigescape.manager.user;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {
    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account login(Account account) {
        Account result = accountRepository.findById(account.getUsername()).orElseThrow();

        if(!result.getUserPw().equals(account.getUserPw())) {
            result = null;
        }
        return result;
    }

    public Account save(Account account) {
        return accountRepository.save(account);
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Optional<Account> findByUsername(String username) {
        return accountRepository.findById(username);
    }
}
