package com.cart.ecom_proj.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Главная страница
    @RequestMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    // Любые другие пути без точки (без .js, .css, .png и т.п.)
    @RequestMapping({"/{path:[^\\.]+}", "/**/{path:[^\\.]+}"})
    public String any() {
        return "forward:/index.html";
    }
}
