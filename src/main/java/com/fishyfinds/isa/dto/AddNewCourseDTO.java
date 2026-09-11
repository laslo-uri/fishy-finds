package com.fishyfinds.isa.dto;

import com.fishyfinds.isa.model.beans.offers.AdditionalService;

import java.util.ArrayList;

public class AddNewCourseDTO {

    private String offerName;
    private String country;
    private String city;
    private String street;
    private String streetNumber;
    private String description;
    private double unitPrice;
    private int maxCustomerCapacity;
    private String rulesOfConduct;
    private String cancellationPolicy;
    private ArrayList<AdditionalService> additionalServices;
    private ArrayList<String> image;

    public AddNewCourseDTO() {}

    public String getOfferName() { return offerName; }
    public void setOfferName(String offerName) { this.offerName = offerName; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getStreetNumber() { return streetNumber; }
    public void setStreetNumber(String streetNumber) { this.streetNumber = streetNumber; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    public int getMaxCustomerCapacity() { return maxCustomerCapacity; }
    public void setMaxCustomerCapacity(int maxCustomerCapacity) { this.maxCustomerCapacity = maxCustomerCapacity; }
    public String getRulesOfConduct() { return rulesOfConduct; }
    public void setRulesOfConduct(String rulesOfConduct) { this.rulesOfConduct = rulesOfConduct; }
    public String getCancellationPolicy() { return cancellationPolicy; }
    public void setCancellationPolicy(String cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }
    public ArrayList<AdditionalService> getAdditionalServices() { return additionalServices; }
    public void setAdditionalServices(ArrayList<AdditionalService> additionalServices) { this.additionalServices = additionalServices; }
    public ArrayList<String> getImage() { return image; }
    public void setImage(ArrayList<String> image) { this.image = image; }
}
