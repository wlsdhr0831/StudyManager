package com.bigescape.manager.fire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FireRepository extends JpaRepository<Fire, Long> {
    List<Fire> findAllByFireDateAndFireType(LocalDate fireDate, FireType fireType);
    Fire findFirstByAccount_UsernameOrderByIdDesc(String username);
}
