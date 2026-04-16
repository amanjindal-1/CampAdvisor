package com.trailnest.api.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    // Optional — only present when spring.mail.host is configured
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendVerificationEmail(String to, String token) {
        String link = frontendUrl + "/verify-email/" + token;
        if (!isMailConfigured()) {
            log.info("[EMAIL] Verification link for {}: {}", to, link);
            return;
        }
        send(to,
                "Verify your TrailNest email",
                "Hi,\n\nClick the link below to verify your email:\n\n" + link
                        + "\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, ignore this email.");
    }

    public void sendPasswordResetEmail(String to, String token) {
        String link = frontendUrl + "/reset-password/" + token;
        if (!isMailConfigured()) {
            log.info("[EMAIL] Password reset link for {}: {}", to, link);
            return;
        }
        send(to,
                "Reset your TrailNest password",
                "Hi,\n\nClick the link below to reset your password:\n\n" + link
                        + "\n\nThis link expires in 1 hour.\n\nIf you didn't request a reset, ignore this email.");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void send(String to, String subject, String text) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
            log.debug("Email sent to {}: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private boolean isMailConfigured() {
        return mailSender != null && !from.isBlank();
    }
}
