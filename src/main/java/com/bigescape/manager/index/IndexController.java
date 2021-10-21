package com.bigescape.manager.index;

import com.bigescape.manager.util.DateAdjuster;
import com.bigescape.manager.fire.Fire;
import com.bigescape.manager.fire.FireService;
import com.bigescape.manager.fire.FireType;
import com.bigescape.manager.user.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.time.format.DateTimeFormatter;

@Controller
@RequiredArgsConstructor
public class IndexController {

    private final FireService fireService;

    @GetMapping("/")
    public ModelAndView index(HttpSession httpSession) {
        Account loginUser = (Account) httpSession.getAttribute("me");
        if(loginUser == null) {
            return new ModelAndView("redirect:/users/login");
        }
        Fire lastFire = fireService.getLastFiredByName(loginUser.getUsername());

        ModelAndView mav = new ModelAndView("index");
        mav.addObject("currentDate", DateTimeFormatter
                .ofPattern("yyyy-MM-dd")
                .format((lastFire != null && FireType.START.equals(lastFire.getFireType())) ? lastFire.getFireDate() : DateAdjuster.officialToday()));
        mav.addObject("fireState", lastFire == null ? FireType.START : lastFire.getFireType());

        return mav;
    }
}
