package com.bigescape.manager.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@IdClass(CommentKey.class)
public class Comment implements Serializable {

    @Id
    private String username;

    @Id
    private LocalDate date;

    private String comment;

    public Comment(CommentKey commentKey, String comment) {
        this.username = commentKey.getUsername();
        this.date = commentKey.getDate();
        this.comment = comment;
    }
}
