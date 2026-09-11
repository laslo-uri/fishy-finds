package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;
    private final String fromAddress = "dislinkt_team_23@yahoo.com";

    public void sendVerificationEmail(Customer user, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String senderName = "Fishy Finds";
        String subject = "Please verify your registration";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "Fishy Finds.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getFirstName());
        String verifyURL = siteURL + "/api/verifyCustomerAccount?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);

    }

    public void sendDeleteReasonEmail(User user, String reasoning)
        throws MessagingException, UnsupportedEncodingException {

        String toAddress= user.getEmail();
        String senderName= "Fishy Finds";
        String subject = "Your request for account deletion has been denied.";
        String content = "Dear [[name]],<br>"
                + "After reviewing your request we have determined that it can not be resolved due to the following:<br>"
                + reasoning + "<br>"
                + "Best regards,<br>"
                + "Fishy Finds.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getFirstName());

        helper.setText(content, true);

        mailSender.send(message);

    }

    public void sendCreationApprovalMail(String email) {
        try {
            String senderName = "Fishy Finds";
            String subject = "Your registration was approved";
            String body = "Dear advertiser,<br>"
                    + "Your FishyFinds registration request has been approved. You can now sign in.<br>"
                    + "Best regards,<br>"
                    + "Fishy Finds.";
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(fromAddress, senderName);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }

    public void sendCreationDenyReasonEmail(User user, String explanation) {
        try {
            String senderName = "Fishy Finds";
            String subject = "Your registration was rejected";
            String body = "Dear [[name]],<br>"
                    + "Your FishyFinds registration request was rejected for the following reason:<br>"
                    + (explanation != null ? explanation : "") + "<br>"
                    + "Best regards,<br>"
                    + "Fishy Finds.";
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(fromAddress, senderName);
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(body.replace("[[name]]", user.getFirstName() != null ? user.getFirstName() : "user"), true);
            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }

    public void sendComplaintResolutionEmail(String email, String name, String reply, boolean accepted, boolean toCustomer) {
        try {
            String senderName = "Fishy Finds";
            String subject = accepted ? "Complaint resolved" : "Complaint response";
            String roleNote = toCustomer ? "Your complaint" : "A complaint about your offer";
            String body = "Dear [[name]],<br>"
                    + roleNote + " has been " + (accepted ? "accepted" : "reviewed") + ".<br>"
                    + "Admin reply:<br>" + (reply != null ? reply : "") + "<br>"
                    + "Best regards,<br>"
                    + "Fishy Finds.";
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(fromAddress, senderName);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(body.replace("[[name]]", name != null ? name : "user"), true);
            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }

    public void sendPenalDecisionEmail(String email, String name, boolean approved, String comment) {
        try {
            String senderName = "Fishy Finds";
            String subject = approved ? "Penalty applied" : "Penalty request declined";
            String body = "Dear [[name]],<br>"
                    + (approved
                        ? "A penalty has been applied based on a visit report.<br>"
                        : "A requested penalty from a visit report was declined.<br>")
                    + (comment != null ? ("Details: " + comment + "<br>") : "")
                    + "Best regards,<br>"
                    + "Fishy Finds.";
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(fromAddress, senderName);
            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(body.replace("[[name]]", name != null ? name : "user"), true);
            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }

    public void sendSuccessfulReservationEmail(Customer user, Reservation reservation) {
        try {
            String toAddress= user.getEmail();
            String senderName= "Fishy Finds";
            String subject = "Your reservation is successful.";
            double discount = user.getLoyaltyProgram() != null ? user.getLoyaltyProgram().getCategoryDiscount() : 0;
            String content = "Dear [[name]],<br>"
                    + "You made reservation for:<br>"
                    + reservation.getOffer().getOfferName() + "<br>"
                    + "Starting: " + reservation.getStartDate() + "<br>"
                    + "Ending: " + reservation.getEndDate() + "<br>"
                    + "Total price: " + reservation.getTotalPrice() + "<br>"
                    + "Discount: " + discount + "% <br>"
                    + "Fishy Finds.";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setFrom(fromAddress, senderName);
            helper.setTo(toAddress);
            helper.setSubject(subject);

            content = content.replace("[[name]]", user.getFirstName());

            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }

    public void sendNewActionEmail(Customer user, Reservation action) {
        try {
            String toAddress = user.getEmail();
            String senderName = "Fishy Finds";
            String subject = "New special action on an offer you follow";
            String offerName = action.getOffer() != null ? action.getOffer().getOfferName() : "an offer";
            String content = "Dear [[name]],<br>"
                    + "A new quick action is available for <strong>" + offerName + "</strong>.<br>"
                    + "Start: " + action.getStartDate() + "<br>"
                    + "End: " + action.getEndDate() + "<br>"
                    + "Price: " + action.getTotalPrice() + "<br>"
                    + "Discount: " + action.getDiscount() + "%<br>"
                    + "Log in to Fishy Finds to book it.<br>"
                    + "Best regards,<br>"
                    + "Fishy Finds.";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setFrom(fromAddress, senderName);
            helper.setTo(toAddress);
            helper.setSubject(subject);
            helper.setText(content.replace("[[name]]", user.getFirstName() != null ? user.getFirstName() : "customer"), true);

            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }

    public void sendFeedbackApprovedEmail(String ownerEmail, String content) {
        try {
            String senderName = "Fishy Finds";
            String subject = "Feedback approved";
            String body = "Dear owner,<br>"
                    + "A customer feedback for your offer has been approved:<br>"
                    + content + "<br>"
                    + "Best regards,<br>"
                    + "Fishy Finds.";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);

            helper.setFrom(fromAddress, senderName);
            helper.setTo(ownerEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (Exception ignored) {
        }
    }
}
