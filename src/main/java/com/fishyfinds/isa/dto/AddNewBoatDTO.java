package com.fishyfinds.isa.dto;

import com.fishyfinds.isa.model.beans.offers.AdditionalService;

import java.util.ArrayList;

public class AddNewBoatDTO {

    private String offerName;
    private String country;
    private String city;
    private String street;
    private String streetNumber;
    private double longitude;
    private double latitude;
    private String description;
    private double unitPrice;
    private int maxCustomerCapacity;
    private String rulesOfConduct;
    private String cancellationPolicy;
    private String boatType;
    private double boatLength;
    private int numberOfEngines;
    private double power;
    private double maxSpeed;
    private ArrayList<AdditionalService> additionalServices;
    private ArrayList<String> image;

    public AddNewBoatDTO() {}

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
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
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
    public String getBoatType() { return boatType; }
    public void setBoatType(String boatType) { this.boatType = boatType; }
    public double getBoatLength() { return boatLength; }
    public void setBoatLength(double boatLength) { this.boatLength = boatLength; }
    public int getNumberOfEngines() { return numberOfEngines; }
    public void setNumberOfEngines(int numberOfEngines) { this.numberOfEngines = numberOfEngines; }
    public double getPower() { return power; }
    public void setPower(double power) { this.power = power; }
    public double getMaxSpeed() { return maxSpeed; }
    public void setMaxSpeed(double maxSpeed) { this.maxSpeed = maxSpeed; }
    public ArrayList<AdditionalService> getAdditionalServices() { return additionalServices; }
    public void setAdditionalServices(ArrayList<AdditionalService> additionalServices) { this.additionalServices = additionalServices; }
    public ArrayList<String> getImage() { return image; }
    public void setImage(ArrayList<String> image) { this.image = image; }
}
