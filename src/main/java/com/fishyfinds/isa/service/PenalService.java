package com.fishyfinds.isa.service;

import com.fishyfinds.isa.model.beans.Penal;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.beans.users.customers.Customer;
import com.fishyfinds.isa.repository.PenalRepository;
import com.fishyfinds.isa.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PenalService {

    @Autowired
    private PenalRepository penalRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Penal getPenalForUser(String username) {
        Customer customer = (Customer) userRepository.findByEmail(username);
        if (customer == null) {
            return null;
        }
        Penal penal = penalRepository.findByCustomer(customer);
        if (penal == null) {
            addNewPenal(customer);
            penal = penalRepository.findByCustomer(customer);
        }
        return penal;
    }

    @Scheduled(cron = "@monthly")
    public void annulPenals(){
        List<Penal> penals = penalRepository.findAll();

        for(Penal penal : penals){
            penal.setNumber(0);
            penalRepository.save(penal);
        }
    }

    public void addNewPenal(Customer user) {
        Penal penal = new Penal();
        penal.setCustomer(user);
        penal.setNumber(0);
        penalRepository.save(penal);
    }
    /**
     * Method used for testing transactions -> called in PenalController
     * @param username -> customer email
     */
    @Transactional
    public void updateExistingPenal(String username, int number){
        Penal penal = getPenalForUser(username);
        penal.setNumber(penal.getNumber() + number);
        penalRepository.save(penal);
    }
}
