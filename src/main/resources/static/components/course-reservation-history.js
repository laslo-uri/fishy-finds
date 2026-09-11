Vue.component('course-reservation-history', {
	data: function(){
		return{
			reservations: [],
			courseToShow: {
			     offerType: "COURSE",
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
                 courseName : "",
                 instructorsName: ""
            },
			showPage: 0,
			sortOption: "",
            feedback:{
                contentForOffer: "",
                contentForOwner: "",
                id: null,
                rateForOffer: null,
                rateForOwner: null
            },
            offerType: "COURSE",
            additionalServices: "",
            filterOptions: "noFilter",
            copyOfReservations: []
        }
	},
template: `
<div class="ff-catalog">
                <nav-bar></nav-bar>
                <section class="ff-catalog__shell">
                    <div class="ff-section-head">
                        <h2>Course reservation history</h2>
                        <p>Past courses - search by name or instructor, sort, filter, and leave feedback.</p>
                    </div>

                    <div v-show="showPage == 0">
                        <div class="ff-filters">
                            <div class="ff-filters__row">
                                <label class="ff-control">
                                    <span>Course name</span>
                                    <input v-model="searchParams.courseName" class="ff-field" type="text" placeholder="Search by course" />
                                </label>
                                <label class="ff-control">
                                    <span>Instructor</span>
                                    <input v-model="searchParams.instructorsName" class="ff-field" type="text" placeholder="Instructor name" />
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
                                    <p class="ff-product__meta">Instructor: {{ reservation.offer && reservation.offer.user ? (reservation.offer.user.firstName + ' ' + reservation.offer.user.lastName) : '' }}</p>
                                    <p class="ff-product__meta">People: {{ reservation.numberOfPeople }} | Total: {{ reservation.totalPrice }} | * {{ reservation.offer && reservation.offer.rating }}</p>
                                    <p class="ff-product__meta">Status: <span v-if="reservation.reservationStatus == 'ACTIVE'">SUCCESS</span><span v-else>{{ reservation.reservationStatus }}</span></p>
                                    <div class="ff-product__actions">
                                        <button v-show="!reservation.hasFeedback" type="button" class="ff-btn ff-btn--primary" @click="showFeedback(reservation)">Add feedback</button>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <p v-if="!reservations.length" class="ff-empty">No course reservations found.</p>
                    </div>

                    <div v-show="showPage == 1">
                        <div class="ff-detail">
                            <div class="ff-detail__toolbar">
                                <button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Back</button>
                            </div>
                            <h3 class="ff-detail__title">{{ courseToShow.offerName }}</h3>
                            <div class="ff-detail__grid">
                                <div><span>Instructor</span><strong>{{ courseToShow.user && courseToShow.user.firstName }} {{ courseToShow.user && courseToShow.user.lastName }}</strong></div>
                                <div><span>Email</span><strong>{{ courseToShow.user && courseToShow.user.email }}</strong></div>
                                <div><span>Phone</span><strong>{{ courseToShow.user && courseToShow.user.phoneNumber }}</strong></div>
                                <div class="ff-detail__wide"><span>Biography</span><strong>{{ courseToShow.user && courseToShow.user.biography }}</strong></div>
                                <div><span>Country</span><strong>{{ courseToShow.location && courseToShow.location.country }}</strong></div>
                                <div><span>City</span><strong>{{ courseToShow.location && courseToShow.location.city }}</strong></div>
                                <div><span>Street</span><strong>{{ courseToShow.location && courseToShow.location.street }} {{ courseToShow.location && courseToShow.location.streetNumber }}</strong></div>
                                <div><span>Price</span><strong>{{ courseToShow.unitPrice }}</strong></div>
                                <div><span>Capacity</span><strong>{{ courseToShow.maxCustomerCapacity }}</strong></div>
                                <div class="ff-detail__wide"><span>Description</span><strong>{{ courseToShow.description }}</strong></div>
                                <div class="ff-detail__wide"><span>Services</span><strong>{{ additionalServices }}</strong></div>
                                <div class="ff-detail__wide"><span>Rules</span><strong>{{ courseToShow.rulesOfConduct }}</strong></div>
                                <div class="ff-detail__wide"><span>Cancellation</span><strong>{{ courseToShow.cancellationPolicy }}</strong></div>
                            </div>
                        </div>
                    </div>

                    <div v-show="showPage == 2">
                        <div class="ff-detail">
                            <div class="ff-detail__toolbar">
                                <button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Back</button>
                            </div>
                            <h3 class="ff-detail__title">Feedback for course and instructor</h3>
                            <div class="ff-form-grid">
                                <input type="text" class="ff-field" disabled :value="courseToShow.offerName" placeholder="Course name" />
                                <input type="text" class="ff-field" disabled :value="courseToShow.user && courseToShow.user.firstName" placeholder="First name" />
                                <input type="text" class="ff-field" disabled :value="courseToShow.user && courseToShow.user.lastName" placeholder="Last name" />
                                <input type="number" class="ff-field" placeholder="Rating for course (1-5)" v-model="feedback.rateForOffer" min="1" max="5" />
                                <input type="number" class="ff-field" placeholder="Rating for instructor (1-5)" v-model="feedback.rateForOwner" min="1" max="5" />
                                <textarea rows="3" class="ff-field ff-field--wide" placeholder="Feedback for course" v-model="feedback.contentForOffer"></textarea>
                                <textarea rows="3" class="ff-field ff-field--wide" placeholder="Feedback for instructor" v-model="feedback.contentForOwner"></textarea>
                            </div>
                            <div class="ff-detail__toolbar" style="margin-top:1rem;">
                                <button type="button" class="ff-btn ff-btn--primary" @click="addFeedback">Send</button>
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
                  params.append('name', this.searchParams.courseName);
                  params.append('location', this.searchParams.courseLocation);
                  params.append('type', 'COURSE');
                  params.append('firstLastName', this.searchParams.instructorsName);
                  return params;
              }
          }
          ,
          methods : {
            showMore : function(course){
                this.courseToShow = course.offer || this.courseToShow;
                this.courseToShow.user = (course.offer && course.offer.user) || this.courseToShow.user || { firstName: '', lastName: '', email: '', phoneNumber: '', biography: '' };
                if (!this.courseToShow.location) {
                  this.courseToShow.location = { country: '', city: '', street: '', streetNumber: '' };
                }
                this.additionalServices = course.additionalServices || '';
                this.showPage = 1;
            },
            showFeedback : function(reservation){
                this.courseToShow = reservation.offer || this.courseToShow;
                this.courseToShow.user = (reservation.offer && reservation.offer.user) || this.courseToShow.user || { firstName: '', lastName: '', email: '', phoneNumber: '', biography: '' };
                if (!this.courseToShow.location) {
                  this.courseToShow.location = { country: '', city: '', street: '', streetNumber: '' };
                }
                this.feedback.id = reservation.id;
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
                                           axios.post("/api/historyOfReservationsForCustomer", {"offerType" : this.offerType})
                                                .then((response) => {this.reservations = response.data; this.showPage = 0; this.copyOfReservations = response.data})
                         }else{
                             Swal.fire(
                                 'Ooops, something went wrong!',
                                 'Please, try again later!',
                                 'error'
                             )
                         }
                     })
                }
            }
            ,
            search : function(){
                if(this.searchParams.courseName != "" && this.searchParams.instructorsName == ""){
                    let newArray = this.reservations.filter(el => {
                         let text = this.searchParams.courseName;
                         return el.offer.offerName.toLowerCase().includes(text);
                     })
                     this.reservations = newArray;
                }else if(this.searchParams.courseName == "" && this.searchParams.instructorsName != ""){
                    let newArray = this.reservations.filter(el => {
                         let text = this.searchParams.instructorsName;
                         return (el.offer.user && (
                                el.offer.user.firstName.toLowerCase().includes(text) ||
                                el.offer.user.lastName.toLowerCase().includes(text)));
                     })
                     this.reservations = newArray;
                }else if(this.searchParams.courseName != "" && this.searchParams.instructorsName != ""){
                    let newArray = this.reservations.filter(el => {
                         let courseText = this.searchParams.courseName;
                         let instructorText = this.searchParams.instructorsName;
                         return el.offer.offerName.toLowerCase().includes(courseText) ||
                                (el.offer.user && (
                                el.offer.user.firstName.toLowerCase().includes(instructorText) ||
                                el.offer.user.lastName.toLowerCase().includes(instructorText)));
                     })
                     this.reservations = newArray;
                }
            }
            ,
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
              axios.post("/api/historyOfReservationsForCustomer", {"offerType" : this.offerType})
                   .then((response) => {this.reservations = response.data; this.copyOfReservations = response.data;})
          }
});
