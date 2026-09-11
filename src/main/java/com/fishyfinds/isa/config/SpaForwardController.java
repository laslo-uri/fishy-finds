package com.fishyfinds.isa.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the Vue SPA for clean history-mode URLs ({@code /bungalows}, not {@code /#/bungalows}).
 * Paths with a file extension and {@code /api/**} stay with resource / REST handlers.
 */
@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            // one segment: /bungalows, /signIn, …
            "/{p1:^(?!api|h2-console|upload|webjars|actuator|components|bootstrap|js|images|openLayers-v6\\.14\\.1)[^\\.]*}",
            // two segments: /actions/12, /reservationForm/3, …
            "/{p1:^(?!api|h2-console|upload|webjars|actuator)[^\\.]*}/{p2:[^.]*}",
            // three segments (aliases / redirects)
            "/{p1:^(?!api|h2-console|upload|webjars|actuator)[^\\.]*}/{p2:[^.]*}/{p3:[^.]*}"
    })
    public String forwardSpa() {
        return "forward:/index.html";
    }
}
