Vue.component('complaints', {
data: function(){
    		return{
    			showPage: 0,
    			sortOption: "",
    			offerName: "",
    			filterOptions: "noFilter",
    			complaint:{
                    content: "",
                    complaintType: "OWNER_COMPLAINT",
                    reservationId : ""
                },
                choosenOffer: {
                    offerId: "",
                    offerName: "",
                    offerUser: {
                        id: "",
                        firstName: "",
                        lastName: ""
                    }
                },
    			reservations:[],
    			copyOfReservations: []
    		}
    	},
    template: `
<div class="ff-catalog">
    		<nav-bar></nav-bar>
            <section class="ff-catalog__shell">
                <div class="ff-section-head">
                    <h2>Complaints</h2>
                    <p>File a complaint about a past reservation offer or owner.</p>
                </div>

                <div v-show="showPage == 0">
                    <div class="ff-filters">
                        <div class="ff-filters__row">
                            <label class="ff-control">
                                <span>Offer name</span>
                                <input v-model="offerName" class="ff-field" type="text" placeholder="Search past offers" />
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
                                <p class="ff-product__meta">{{ reservation.offer && reservation.offer.user ? (reservation.offer.user.firstName + ' ' + reservation.offer.user.lastName) : '' }}</p>
                                <p>{{ reservation.offer && reservation.offer.description }}</p>
                                <p class="ff-product__meta">* {{ reservation.offer && reservation.offer.rating }}</p>
                                <div class="ff-product__actions">
                                    <button type="button" class="ff-btn ff-btn--primary" @click="showComplaintForm(reservation)">Write complaint</button>
                                </div>
                            </div>
                        </article>
                    </div>
                    <p v-if="!reservations.length" class="ff-empty">No past reservations available for complaints.</p>
                </div>

                <div v-show="showPage == 1">
                    <div class="ff-detail">
                        <div class="ff-detail__toolbar">
                            <button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Back</button>
                        </div>
                        <h3 class="ff-detail__title">Complaint form</h3>
                        <div class="ff-form-grid">
                            <select class="ff-field" v-model="complaint.complaintType">
                                <option value="OWNER_COMPLAINT">Owner</option>
                                <option value="OFFER_COMPLAINT">Offer</option>
                                <option value="BOTH_COMPLAINT">Both</option>
                            </select>
                            <input type="text" class="ff-field" disabled v-model="choosenOffer.offerName" placeholder="Offer name" />
                            <input type="text" class="ff-field" disabled v-model="choosenOffer.offerUser.firstName" placeholder="First name" />
                            <input type="text" class="ff-field" disabled v-model="choosenOffer.offerUser.lastName" placeholder="Last name" />
                            <textarea rows="5" class="ff-field ff-field--wide" v-model="complaint.content" placeholder="Complaint"></textarea>
                        </div>
                        <div class="ff-detail__toolbar" style="margin-top:1rem;">
                            <button type="button" class="ff-btn ff-btn--primary" :disabled="isFilled" @click="addComplaint">Send</button>
                        </div>
                    </div>
                </div>
            </section>
    	</div>
    		`
          ,
          computed: {
              isFilled(){
                return !/\S/.test(this.complaint.content);
              }
          }
          ,
          methods : {
            showComplaintForm : function(reservation){
                this.choosenOffer.offerId = reservation.id;
                this.choosenOffer.offerName = reservation.offer.offerName;
                this.choosenOffer.offerUser.id = reservation.offer.user ? reservation.offer.user.id : '';
                this.choosenOffer.offerUser.firstName = reservation.offer.user ? reservation.offer.user.firstName : '';
                this.choosenOffer.offerUser.lastName = reservation.offer.user ? reservation.offer.user.lastName : '';
                this.showPage = 1;
            },
            search : function(){
                let newArray = this.reservations.filter(el => {
                    let text = this.offerName;
                    return el.offer.offerName.toLowerCase().includes(text);
                })
                this.reservations = newArray;
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
            addComplaint : function(){
                axios.defaults.headers.common["Authorization"] =
                                       localStorage.getItem("user");
                 axios.post('/api/addComplaint', {"content": this.complaint.content,
                                                  "reservationId": this.choosenOffer.offerId,
                                                  "complaintType": this.complaint.complaintType})
                     .then(response => {
                         if(response.data){
                             Swal.fire(
                                 'Complaint sent successfuly!',
                                 '',
                                 'success'
                             )
                             axios.defaults.headers.common["Authorization"] =
                                                                         localStorage.getItem("user");
                             axios.get("/api/allPassedReservationsForCustomerWithoutDuplicatedOffers")
                                   .then((response) => {this.reservations = response.data; this.showPage = 0; this.copyOfReservations = response.data})

                         }else{
                             Swal.fire(
                                 'Ooops, something went wrong!',
                                 'Please, try again later!',
                                 'error'
                             )
                         }
                     })
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
            axios.get("/api/allPassedReservationsForCustomerWithoutDuplicatedOffers")
                 .then((response) => {this.reservations = response.data; this.copyOfReservations = response.data;})
        }

});