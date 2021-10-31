package com.bigescape.manager.comment;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UpdateCommentRequest {
    private String username;
    private LocalDate date;
    private String comment;
}
