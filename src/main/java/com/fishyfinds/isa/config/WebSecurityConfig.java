package com.fishyfinds.isa.config;

import com.fishyfinds.isa.security.TokenUtils;
import com.fishyfinds.isa.security.auth.RestAuthenticationEntryPoint;
import com.fishyfinds.isa.security.auth.TokenAuthenticationFilter;
import com.fishyfinds.isa.service.users.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private CustomUserDetailsService jwtUserDetailsService;

    @Autowired
    private RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder());
    }

    @Autowired
    private TokenUtils tokenUtils;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .exceptionHandling().authenticationEntryPoint(restAuthenticationEntryPoint).and()
                .authorizeRequests()
                // Public auth / registration
                .antMatchers(HttpMethod.POST, "/api/signIn").permitAll()
                .antMatchers(HttpMethod.POST, "/api/registerUser").permitAll()
                .antMatchers("/api/verifyCustomerAccount").permitAll()
                .antMatchers("/h2-console/**").permitAll()
                // Public catalog / browse APIs (guests)
                .antMatchers(HttpMethod.GET, "/api/search").permitAll()
                .antMatchers(HttpMethod.GET, "/api/allBoats").permitAll()
                .antMatchers(HttpMethod.GET, "/api/allBungalows").permitAll()
                .antMatchers(HttpMethod.GET, "/api/allCourses").permitAll()
                .antMatchers(HttpMethod.GET, "/api/getTermsByOfferId/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/allAcceptedFeedbacksForOffer").permitAll()
                .antMatchers(HttpMethod.GET, "/api/getActionsForOffer").permitAll()
                // Everything else under /api needs JWT
                .antMatchers("/api/**").authenticated()
                // Vue history-mode pages + static assets (any GET outside /api)
                .antMatchers(HttpMethod.GET, "/**").permitAll()
                .anyRequest().authenticated().and()
                .cors().and()
                .addFilterBefore(new TokenAuthenticationFilter(tokenUtils, jwtUserDetailsService), BasicAuthenticationFilter.class);
        http.csrf().disable();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        // Skip security filter for static assets (performance); SPA HTML routes use permitAll above
        web.ignoring().antMatchers(HttpMethod.POST, "/api/signIn");
        web.ignoring().antMatchers(HttpMethod.GET,
                "/webjars/**", "/*.html", "/favicon.ico", "/**/*.html",
                "/**/*.css", "/**/*.js", "/images/**", "/**/*.ttf", "/*.css", "/upload/**",
                "/components/**", "/bootstrap/**", "/openLayers-v6.14.1/**", "/js/**",
                "/theme.css", "/index.css", "/profile.css", "/dropdown.css",
                "/radio-toolbar.css", "/flat-table.css");
    }
}
