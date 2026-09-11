Vue.component('bungalow-reservation-history', {
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
    			searchParams: {
    			    bungalowName : "",
    			    bungalowLocation: ""
    			},
    			reservations:[],
                feedback:{
                    contentForOffer: "",
                    contentForOwner: "",
                    id: null,
                    rateForOffer: null,
                    rateForOwner: null
                },
                offerType: "BUNGALOW",
                additionalServices: "",
                copyOfReservations: [],
                filterOptions: "noFilter"
    		}
    	},
    template: `
<div class="ff-catalog">
    		<nav-bar></nav-bar>
            <section class="ff-catalog__shell">
                <div class="ff-section-head">
                    <h2>Bungalow reservation history</h2>
                    <p>Past bungalow stays - search, sort, filter, and leave feedback.</p>
                </div>

                <div v-show="showPage == 0">
                    <div class="ff-filters">
                        <div class="ff-filters__row">
                            <label class="ff-control">
                                <span>Bungalow name</span>
                                <input v-model="searchParams.bungalowName" class="ff-field" type="text" placeholder="Search by name" />
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
                                <span>Status</span>
                                <select v-model="filterOptions" class="ff-field" @change="filterArray">
                                    <option value="noFilter">All statuses</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="FAIL">Failed (no-show)</option>
                                    <option value="ACTIVE">Successful</option>
                                </select>
                            </label>
                            <div class="ff-filters__actions">
                                <button class="ff-btn ff-btn--primary" type="button" @click="search">Search</button>
                            </div>
                        </div>
                        <p class="ff-filters__hint">Sort and status filter apply immediately.</p>
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
                                <p class="ff-product__meta">People: {{ reservation.numberOfPeople }} | Unit: {{ reservation.offer && reservation.offer.unitPrice }} | Total: {{ reservation.totalPrice }} | * {{ reservation.offer && reservation.offer.rating }}</p>
                                <p class="ff-product__meta">Status: <span v-if="reservation.reservationStatus == 'ACTIVE'">SUCCESS</span><span v-else>{{ reservation.reservationStatus }}</span></p>
                                <div class="ff-product__actions">
                                    <button v-show="!reservation.hasFeedback" type="button" class="ff-btn ff-btn--primary" @click="showFeedback(reservation)">Add feedback</button>
                                </div>
                            </div>
                        </article>
                    </div>
                    <p v-if="!reservations.length" class="ff-empty">No bungalow reservations found.</p>
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
                            <div class="ff-detail__wide"><span>Services</span><strong>{{ additionalServices }}</strong></div>
                            <div class="ff-detail__wide"><span>Rules</span><strong>{{ bungalowToShow.rulesOfConduct }}</strong></div>
                            <div class="ff-detail__wide"><span>Cancellation</span><strong>{{ bungalowToShow.cancellationPolicy }}</strong></div>
                        </div>
                    </div>
                </div>

                <div v-show="showPage == 2">
                    <div class="ff-detail">
                        <div class="ff-detail__toolbar">
                            <button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Back</button>
                        </div>
                        <h3 class="ff-detail__title">Feedback for bungalow and owner</h3>
                        <div class="ff-form-grid">
                            <input type="text" class="ff-field" disabled :value="bungalowToShow.offerName" placeholder="Bungalow name" />
                            <input type="text" class="ff-field" disabled :value="bungalowToShow.user && bungalowToShow.user.firstName" placeholder="Owner first name" />
                            <input type="text" class="ff-field" disabled :value="bungalowToShow.user && bungalowToShow.user.lastName" placeholder="Owner last name" />
                            <input type="number" class="ff-field" placeholder="Rating for owner (1-5)" v-model="feedback.rateForOwner" min="1" max="5" />
                            <input type="number" class="ff-field" placeholder="Rating for bungalow (1-5)" v-model="feedback.rateForOffer" min="1" max="5" />
                            <textarea rows="3" class="ff-field ff-field--wide" placeholder="Feedback for owner" v-model="feedback.contentForOwner"></textarea>
                            <textarea rows="3" class="ff-field ff-field--wide" placeholder="Feedback for bungalow" v-model="feedback.contentForOffer"></textarea>
                        </div>
                        <div class="ff-detail__toolbar" style="margin-top:1rem;">
                            <button type="button" class="ff-btn ff-btn--primary" :disabled="isFilled" @click="addFeedback">Send</button>
                        </div>
                    </div>
                </div>
            </section>
    	</div>
    		`
          ,
          computed: {
              axiosParams() {
                  const params = new URLSearchParams();
                  params.append('name', this.searchParams.bungalowName);
                  params.append('location', this.searchParams.bungalowLocation);
                  params.append('type', 'BUNGALOW');
                  return params;
              },
              isFilled(){
                return !(/\S/.test(this.feedback.contentForOwner) || /\S/.test(this.feedback.contentForOffer) || /\S/.test(this.feedback.rateForOwner) || /\S/.test(this.feedback.rateForOffer));
              }
          }
          ,
          methods : {
            showMore : function(bung){
               this.bungalowToShow = bung.offer || this.bungalowToShow;
               if (!this.bungalowToShow.location) {
                 this.bungalowToShow.location = { country: '', city: '', street: '', streetNumber: '' };
               }
               this.additionalServices = bung.additionalServices || '';
               this.showPage = 1;
            },
            showFeedback : function(bung){
                this.bungalowToShow = bung.offer || this.bungalowToShow;
                if (!this.bungalowToShow.location) {
                  this.bungalowToShow.location = { country: '', city: '', street: '', streetNumber: '' };
                }
                this.feedback.id = bung.id;
                this.showPage = 2;
            },
            filterArray : function(){
                if(this.filterOptions === "noFilter"){
                    this.reservations = this.copyOfReservations;
                }else{
                    this.reservations = this.copyOfReservations;
                    let newArray = this.reservations.filter(el => {
                        return el.reservationStatus === this.filterOptions;
                    })

                    this.reservations = newArray;
                }
            },
            search : function(){
                let newArray = this.reservations.filter(el => {
                    let text = this.searchParams.bungalowName;
                    return el.offer.offerName.toLowerCase().includes(text);
                })
                this.reservations = newArray;
            },
            addFeedback : function(){
               if(this.feedback.contentForOffer == "" && this.feedback.contentForOwner == "" && this.feedback.rateForOffer == null && this.feedback.rateForOwner == null){
                    Swal.fire(
                          'Fields are empty!',
                          'Please, fill the fields in order to send feedback!',
                          'error'
                          )
               }else if(this.feedback.rateForOffer != null && Number(this.feedback.rateForOffer) <= 0 || Number(this.feedback.rateForOffer > 5)){
                    Swal.fire(
                           'Invalid values for rate for offer!',
                           'Number must be from 1 to 5!',
                           'error'
                           )
               }else if(this.feedback.rateForOwner != null && Number(this.feedback.rateForOwner) <= 0 || Number(this.feedback.rateForOwner > 5)){
                     Swal.fire(
                           'Invalid values for rate for owner!',
                           'Number must be from 1 to 5!',
                           'error'
                     )
               }else{
                axios.defaults.headers.common["Authorization"] =
                                    localStorage.getItem("user");
                axios.post('/api/addFeedback', this.feedback)
                     .then(response => {
                         if(response.data){
                             Swal.fire(
                                 'Complaint sent successfuly!',
                                 '',
                                 'success'
                             )
                             axios.defaults.headers.common["Authorization"] =
                                                                         localStorage.getItem("user");
                                         axios.post("/api/historyOfReservationsForCustomer", { "offerType" : this.offerType })
                                              .then((response) => {this.reservations = response.data; this.showPage = 0; this.copyOfReservations = response.data;})
                         }else{
                             Swal.fire(
                                 'Ooops, something went wrong!',
                                 'Please, try again later!',
                                 'error'
                             )
                         }
                     })
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
            axios.post("/api/historyOfReservationsForCustomer", { "offerType" : this.offerType })
                 .then((response) => {this.reservations = response.data; this.copyOfReservations = response.data;})
        }

});