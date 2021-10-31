package com.bigescape.manager.comment;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
public class CommentController {

    public final CommentService commentService;

    @GetMapping("/comments")
    public ResponseEntity getCommentByCommentKey(
            @RequestParam String username,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date
    ) {
        return ResponseEntity.ok(commentService.findByUsernameAndDate(username, date));
    }

    @PostMapping("/comments")
    public ResponseEntity saveComment(@RequestBody UpdateCommentRequest request) {
        commentService.save(Comment.builder()
                .username(request.getUsername())
                .date(request.getDate())
                .comment(request.getComment())
                .build()
        );

        return ResponseEntity.ok().build();
    }

}
