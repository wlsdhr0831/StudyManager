package com.bigescape.manager.util;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DateAdjuster {
    private static final int LIMIT_OF_HOUR_TO_BE_TODAY = 5;

    public static LocalDate officialToday() {
        LocalDateTime nowDateTime = LocalDateTime.now();
        LocalDate nowDate = LocalDate.now();
        int isAfterZero = nowDateTime.compareTo(nowDate.atTime(0, 0, 0, 0));
        int isBeforeSix = nowDate.atTime(LIMIT_OF_HOUR_TO_BE_TODAY, 0, 0, 0).compareTo(nowDateTime);

        if(isAfterZero >= 0 && isBeforeSix > 0) {
            nowDate = nowDate.minusDays(1);
        }

        return nowDate;
    }
}
