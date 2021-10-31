package com.bigescape.manager.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public void save(Comment comment) {
        commentRepository.save(comment);
    }

    public Comment findByUsernameAndDate(String username, LocalDate date) {
        return commentRepository.findById(
                CommentKey.builder()
                .username(username)
                .date(date)
                .build()
        ).orElse(null);
    }

}
