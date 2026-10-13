package com.fishyfinds.isa.model.beans.offers;

import com.fishyfinds.isa.model.beans.offers.bungalows.Bungalow;
import com.fishyfinds.isa.model.beans.users.User;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@Table
@SequenceGenerator(name = "sequence", sequenceName = "mySequence")
public class ImageItem {

    @Id
    @GenericGenerator(name = "seq", strategy="increment")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "seq")
    private Long id;

    @Column(name="name")
    protected String name;

    @Column(name="filepath")
    protected String path;

    @Column(name="isDeleted")
    protected boolean isDeleted = false;

    public ImageItem() {}
    public ImageItem(String name, String path, boolean isDeleted) {
        this.name = name;
        this.path = path;
        this.isDeleted = isDeleted;
    }

    public static String firstPath(Collection<ImageItem> images) {
        if (images == null || images.isEmpty()) {
            return "images/no-pictures.png";
        }
        for (ImageItem image : images) {
            if (image != null && "first".equals(image.getName()) && image.getPath() != null) {
                return image.getPath();
            }
        }
        for (ImageItem image : images) {
            if (image != null && image.getPath() != null) {
                return image.getPath();
            }
        }
        return "images/no-pictures.png";
    }
}
