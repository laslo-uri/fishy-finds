package com.fishyfinds.isa.model.beans.offers;

import com.fishyfinds.isa.model.beans.terms.Term;
import com.fishyfinds.isa.model.beans.users.User;
import com.fishyfinds.isa.model.enums.OfferType;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Table(name = "Offer")
@SequenceGenerator(name = "sequence", sequenceName = "mySequence")
public class Offer {

    @Id
    @GenericGenerator(name = "seq", strategy="increment")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "seq")
    protected Long id;

    @Column(name = "offerType", nullable = false)
    protected OfferType offerType;

    @Column(name = "offerName", nullable = false)
    protected String offerName;

    @OneToOne
    @JoinColumn(name="users", referencedColumnName = "id")
    protected User user;

    @OneToOne
    @JoinColumn(name="location", referencedColumnName = "id")
    protected Location location;

    @Column(name = "description", nullable = false)
    protected String description;

    @Column(name = "unitPrice", nullable = false)
    protected double unitPrice;

    @Column(name = "rating", nullable = false)
    protected double rating;
/*
    @OneToMany(mappedBy="id", fetch = FetchType.EAGER)
    protected Set<Term> terms;
 */

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    protected Set<ImageItem> images = new HashSet<ImageItem>();

    @Column(name = "maxCustomerCapacity", nullable = false)
    protected int maxCustomerCapacity;

    @Column(name = "rulesOfConduct", nullable = false)
    protected String rulesOfConduct;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "offerAdditionalService",
               joinColumns = @JoinColumn(name = "offerId", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "additionalServiceId", referencedColumnName = "id"))
    protected Set<AdditionalService> additionalServices = new HashSet<AdditionalService>();

    @Column(name = "cancellationPolicy", nullable = false)
    protected String cancellationPolicy;

    @Column(name = "isDeleted", nullable = false, columnDefinition = "boolean default false")
    protected boolean isDeleted = false;

   /* @OneToMany(mappedBy="id", fetch = FetchType.EAGER)
    protected Set<UserFeedback> reviews;*/


}
