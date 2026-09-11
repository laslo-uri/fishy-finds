package com.fishyfinds.isa.model.beans;

import com.fishyfinds.isa.model.beans.terms.Reservation;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "VisitReport")
public class VisitReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation", referencedColumnName = "id")
    private Reservation reservation;

    @Column(name = "comment")
    private String comment;

    @Column(name = "requestPenal")
    private boolean requestPenal;

    @Column(name = "noShow")
    private boolean noShow;

    @Column(name = "status")
    private ComplaintStatus status;

    @ManyToOne
    @JoinColumn(name = "submittedBy", referencedColumnName = "id")
    private User submittedBy;

    public VisitReport() {}
}
