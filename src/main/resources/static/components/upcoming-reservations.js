Vue.component('upcoming-reservations', {
data: function(){
    		return{
    			showPage: 0,
    			sortOption: "",
    			bungalowToShow: {
    			    id: 0,
    			    offerType: "BUNGALOW",
                    offerName: "",
                    user: {
                        biography: "",
                        email: "",
                        firstName: "",
                        lastName: "",
                        phoneNumber: ""
                    },
                    location:{
                        country: "",
                        city: "",
                        street: "",
                        streetNumber:""
                    },
                    description:"",
                    unitPrice:"",
                    maxCustomerCapacity:"",
                    maxCustomerCapacity:"",
                    rulesOfConduct:"",
                    additionalServices:"",
                    cancellationPolicy:""
    			},
    		    offerName : "",
    			reservations:[],
    			complaint:{
    			    content: "",
    			    offer: null,
    			    user: null
    			},
                feedback:{
                    content: "",
                    id: null,
                    rate: null
                },
                filterOptions: "noFilter",
                copyOfReservations: []
    		}
    	},
    template: `
<div class="ff-catalog">
    		<nav-bar></nav-bar>
            <section class="ff-catalog__shell">
                <div class="ff-section-head">
                    <h2>Upcoming reservations</h2>
                    <p>Your future bookings - search, sort, filter, or cancel.</p>
                </div>

                <div v-show="showPage == 0">
                    <div class="ff-filters">
                        <div class="ff-filters__row">
                            <label class="ff-control">
                                <span>Offer name</span>
                                <input v-model="offerName" class="ff-field" type="text" placeholder="Search bookings" />
                            </label>
                            <label class="ff-control">
                                <span>Sort results</span>
                                <select v-model="sortOption" class="ff-field" @change="sortedArray">
                                    <option disabled value="">Choose order</option>
                                    <option value="AscAlpha">Name A-Z</option>
                                    <option value="DescAlpha">Name Z-A</option>
                                    <option value="AscRating">Rating up</option>
                                    <option value="DescRating">Rating down</option>
                                    <option value="AscPrice">Unit price up</option>
                                    <option value="DescPrice">Unit price down</option>
                                    <option value="AscTotalPrice">Total price up</option>
                                    <option value="DescTotalPrice">Total price down</option>
                                    <option value="AscDuration">Duration up</option>
                                    <option value="DescDuration">Duration down</option>
                                    <option value="AscStartDate">Start up</option>
                                    <option value="DescStartDate">Start down</option>
                                    <option value="AscEndDate">End up</option>
                                    <option value="DescEndDate">End down</option>
                                </select>
                            </label>
                            <label class="ff-control">
                                <span>Type</span>
                                <select v-model="filterOptions" class="ff-field" @change="filterArray">
                                    <option value="noFilter">All types</option>
                                    <option value="BUNGALOW">Bungalows</option>
                                    <option value="BOAT">Boats</option>
                                    <option value="COURSE">Courses</option>
                                </select>
                            </label>
                            <div class="ff-filters__actions">
                                <button class="ff-btn ff-btn--primary" type="button" @click="search">Search</button>
                            </div>
                        </div>
                        <p class="ff-filters__hint">Sort and type filter apply immediately.</p>
                    </div>
                    <div class="ff-product-grid">
                        <article class="ff-product" v-for="reservation in reservations" :key="reservation.id">
                            <div class="ff-product__media">
                                <img :src="reservation.path || 'images/no-pictures.jpg'" :alt="reservation.offer && reservation.offer.offerName" />
                            </div>
                            <div class="ff-product__body">
                                <h3>{{ reservation.offer && reservation.offer.offerName }}</h3>
                                <p class="ff-product__meta">{{ reservation.startDate }} - {{ reservation.endDate }}</p>
                                <p>{{ reservation.offer && reservation.offer.description }}</p>
                                <p class="ff-product__meta">People: {{ reservation.numberOfPeople }} | Total: {{ reservation.totalPrice }} | * {{ reservation.offer && reservation.offer.rating }}</p>
                                <div class="ff-product__actions">
                                    <button type="button" class="ff-btn ff-btn--ink" @click="cancelReservation(reservation)">Cancel reservation</button>
                                </div>
                            </div>
                        </article>
                    </div>
                    <p v-if="!reservations.length" class="ff-empty">No upcoming reservations.</p>
                </div>

                <div v-show="showPage == 1">
                    <div class="ff-detail">
                        <div class="ff-detail__toolbar">
                            <button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Back</button>
                        </div>
                        <h3 class="ff-detail__title">{{ bungalowToShow.offerName }}</h3>
                        <div class="ff-detail__grid">
                            <div><span>Country</span><strong>{{ bungalowToShow.location && bungalowToShow.location.country }}</strong></div>
                            <div><span>City</span><strong>{{ bungalowToShow.location && bungalowToShow.location.city }}</strong></div>
                            <div><span>Street</span><strong>{{ bungalowToShow.location && bungalowToShow.location.street }} {{ bungalowToShow.location && bungalowToShow.location.streetNumber }}</strong></div>
                            <div><span>Price</span><strong>{{ bungalowToShow.unitPrice }}</strong></div>
                            <div><span>Capacity</span><strong>{{ bungalowToShow.maxCustomerCapacity }}</strong></div>
                            <div class="ff-detail__wide"><span>Description</span><strong>{{ bungalowToShow.description }}</strong></div>
                            <div class="ff-detail__wide"><span>Services</span><strong>{{ bungalowToShow.additionalServices }}</strong></div>
                            <div class="ff-detail__wide"><span>Rules</span><strong>{{ bungalowToShow.rulesOfConduct }}</strong></div>
                            <div class="ff-detail__wide"><span>Cancellation</span><strong>{{ bungalowToShow.cancellationPolicy }}</strong></div>
                        </div>
                    </div>
                </div>
            </section>
    	</div>
    		`
          ,
          methods : {
            showMore : function(bung){
               this.bungalowToShow = Object.assign({
                    location: { country: '', city: '', street: '', streetNumber: '' },
                    user: { firstName: '', lastName: '', email: '', phoneNumber: '', biography: '' },
                    additionalServices: []
               }, bung.offer || {});
               if (!this.bungalowToShow.location) {
                 this.bungalowToShow.location = { country: '', city: '', street: '', streetNumber: '' };
               }
               let addServices = "";
               const services = Array.isArray(this.bungalowToShow.additionalServices) ? this.bungalowToShow.additionalServices : [];
               for(let i = 0; i < services.length; i++){
                addServices = addServices + " " + services[i].name;
               }
               this.bungalowToShow.additionalServices = addServices;
               this.showPage = 1;
            },
            search : function(){
                let newArray = this.reservations.filter(el => {
                    let text = this.offerName;
                    return el.offer.offerName.toLowerCase().includes(text);
                })
                this.reservations = newArray;
            },
            cancelReservation : function(reservation){
                axios.post("/api/cancelReservation", {"id" : reservation.id})
                     .then((response)=>{
                        if(response.data){
                            axios.defaults.headers.common["Authorization"] =
                                           localStorage.getItem("user");
                            axios.get("/api/upcomingReservationsForCustomer")
                                 .then((response) => {this.reservations = response.data})
                        }else{
                            Swal.fire('Ooops, something went wrong!',
                	                  'Please, try again later',
                	                  'error')
                        }
                     })
            },
            filterArray: function(){
                if(this.filterOptions === "noFilter"){
                    this.reservations = this.copyOfReservations;
                }else{
                    this.reservations = this.copyOfReservations;
                    let newArray = this.reservations.filter(el => {
                        return el.offer.offerType === this.filterOptions;
                    })

                    this.reservations = newArray;
                }
            },
            sortedArray: function() {
                if(this.sortOption === 'DescAlpha'){
                                   function compare(a, b) {
                                     if (a.offer.offerName > b.offer.offerName)
                                       return -1;
                                     if (a.offer.offerName < b.offer.offerName)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscAlpha'){
                                    function compare(a, b) {
                                        if (a.offer.offerName < b.offer.offerName)
                                           return -1;
                                        if (a.offer.offerName > b.offer.offerName)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                                if(this.sortOption === 'DescRating'){
                                   function compare(a, b) {
                                     if (a.offer.rating > b.offer.rating)
                                       return -1;
                                     if (a.offer.rating < b.offer.rating)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscRating'){
                                    function compare(a, b) {
                                        if (a.offer.rating < b.offer.rating)
                                           return -1;
                                        if (a.offer.rating > b.offer.rating)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                                if(this.sortOption === 'DescPrice'){
                                   function compare(a, b) {
                                     if (a.offer.unitPrice > b.offer.unitPrice)
                                       return -1;
                                     if (a.offer.unitPrice < b.offer.unitPrice)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscPrice'){
                                    function compare(a, b) {
                                        if (a.offer.unitPrice < b.offer.unitPrice)
                                           return -1;
                                        if (a.offer.unitPrice > b.offer.unitPrice)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                                if(this.sortOption === 'DescTotalPrice'){
                                   function compare(a, b) {
                                     if (a.totalPrice > b.totalPrice)
                                       return -1;
                                     if (a.totalPrice < b.totalPrice)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscTotalPrice'){
                                    function compare(a, b) {
                                        if (a.totalPrice < b.totalPrice)
                                           return -1;
                                        if (a.totalPrice > b.totalPrice)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                                if(this.sortOption === 'DescDuration'){
                                   function compare(a, b) {
                                     if (a.duration > b.duration)
                                       return -1;
                                     if (a.duration < b.duration)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscDuration'){
                                    function compare(a, b) {
                                        if (a.duration < b.duration)
                                           return -1;
                                        if (a.duration > b.duration)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                                if(this.sortOption === 'DescStartDate'){
                                   function compare(a, b) {
                                     if (a.startDate > b.startDate)
                                       return -1;
                                     if (a.startDate < b.startDate)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscStartDate'){
                                    function compare(a, b) {
                                        if (a.startDate < b.startDate)
                                           return -1;
                                        if (a.startDate > b.startDate)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                                if(this.sortOption === 'DescEndDate'){
                                   function compare(a, b) {
                                     if (a.endDate > b.endDate)
                                       return -1;
                                     if (a.endDate < b.endDate)
                                       return 1;
                                    return 0;
                                  }
                                   return this.reservations.sort(compare);
                               }
                                if(this.sortOption === 'AscEndDate'){
                                    function compare(a, b) {
                                        if (a.endDate < b.endDate)
                                           return -1;
                                        if (a.endDate > b.endDate)
                                           return 1;
                                        return 0;
                                    }
                                    return this.reservations.sort(compare);
                                }
                         }
          },
        mounted(){
            axios.defaults.headers.common["Authorization"] =
                                            localStorage.getItem("user");
            axios.get("/api/upcomingReservationsForCustomer")
                 .then((response) => {this.reservations = response.data; this.copyOfReservations = response.data;})
        }

});