package com.bigescape.manager.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/users")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "/user/login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "/user/register";
    }

    @PostMapping("/login")
    public ModelAndView login(@ModelAttribute Account account, HttpServletRequest request) {
        Account loginUser = accountService.login(account);

        String returnUrl = "redirect:/";
        if(loginUser != null) {
            request.getSession().setAttribute("me", loginUser);
        }else {
            returnUrl = "redirect:/users/login";
        }
        return new ModelAndView(returnUrl);
    }

    @PostMapping("/register")
    public ModelAndView register(@ModelAttribute Account account) {
        ModelAndView mav = new ModelAndView("/user/login");

        accountService.save(account);

        return mav;
    }
}
