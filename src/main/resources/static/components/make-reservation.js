Vue.component('make-reservation', {
	data: function(){
		return{
            filterDto: {
                offerType: 'BUNGALOW',
                start: '',
                duration: '',
                numberOfPeople: ''
            },
            allTerms: [],
            dto : {
                termId : "",
                offerId : "",
                startDate : "",
                duration : "",
                numberOfPeople: "",
                additionalServices: ""
            },
            choosenOfferTerm: {
                id: "",
                offer: {
                    id: "",
                    unitPrice: 0,
                    additionalServices: []
                }
            },
            showPage: 0
		};
	},
template: `
	<div class="ff-catalog">
        <nav-bar></nav-bar>
        <section class="ff-catalog__shell">
            <div class="ff-section-head">
                <h2>Make a reservation</h2>
                <p>Search available terms by type, date, duration, and party size.</p>
            </div>

            <div v-show="showPage == 0">
                <div class="ff-filters">
                    <div class="ff-filters__row">
                        <label class="ff-control">
                            <span>Offer type</span>
                            <select class="ff-field" v-model="filterDto.offerType">
                                <option value="BUNGALOW">Bungalow</option>
                                <option value="BOAT">Boat</option>
                                <option value="COURSE">Course</option>
                            </select>
                        </label>
                        <label class="ff-control">
                            <span>Start date</span>
                            <input v-model="filterDto.start" class="ff-field" type="datetime-local" />
                        </label>
                        <label class="ff-control">
                            <span>Duration (days)</span>
                            <input type="number" min="1" v-model="filterDto.duration" class="ff-field" placeholder="e.g. 3" />
                        </label>
                        <label class="ff-control">
                            <span>Guests</span>
                            <input type="number" min="1" v-model="filterDto.numberOfPeople" class="ff-field" placeholder="e.g. 2" />
                        </label>
                        <div class="ff-filters__actions">
                            <button type="button" class="ff-btn ff-btn--primary" @click="filterTerms">Search</button>
                        </div>
                    </div>
                    <p class="ff-filters__hint">Fill all fields to find free terms that match your stay.</p>
                </div>

                <div class="ff-product-grid">
                    <article class="ff-product" v-for="b in allTerms" :key="b.id">
                        <div class="ff-product__media">
                            <img :src="b.path || 'images/no-pictures.jpg'" :alt="b.offer.offerName">
                        </div>
                        <div class="ff-product__body">
                            <h3>{{ b.offer.offerName }}</h3>
                            <p class="ff-product__meta">{{ b.offer.unitPrice }} | * {{ b.offer.rating }}</p>
                            <p>{{ b.offer.description }}</p>
                            <p class="ff-product__meta" v-if="b.offer.location">
                                {{ b.offer.location.street }} {{ b.offer.location.streetNumber }},
                                {{ b.offer.location.city }}, {{ b.offer.location.country }}
                            </p>
                            <div class="ff-product__actions">
                                <button class="ff-btn ff-btn--primary" type="button" @click="showMakeReservation(b)">Book</button>
                            </div>
                        </div>
                    </article>
                </div>
                <p v-if="!allTerms.length" class="ff-empty">No available terms yet - adjust filters and search.</p>
            </div>

            <div v-show="showPage == 1" class="ff-detail">
                <div class="ff-detail__toolbar">
                    <button class="ff-btn ff-btn--ink" type="button" @click="showPage = 0">Back</button>
                </div>
                <h3 class="ff-detail__title">Confirm reservation</h3>
                <div class="ff-detail__grid">
                    <div><span>Start</span><strong>{{ filterDto.start }}</strong></div>
                    <div><span>Duration</span><strong>{{ filterDto.duration }}</strong></div>
                    <div><span>People</span><strong>{{ filterDto.numberOfPeople }}</strong></div>
                    <div><span>Unit price</span><strong>{{ choosenOfferTerm.offer.unitPrice }}</strong></div>
                    <div class="ff-detail__wide"><span>Total</span><strong>{{ choosenOfferTerm.offer.unitPrice * filterDto.numberOfPeople }}</strong></div>
                </div>
                <p class="ff-detail__title" style="margin-top:1.25rem;font-size:1rem;">Additional services</p>
                <div v-for="a in (choosenOfferTerm.offer.additionalServices || [])" :key="a.name" style="margin-bottom:0.4rem;">
                    <input type="checkbox" name="addService" :id="a.name"/>
                    <label :for="a.name">{{ a.name }}</label>
                </div>
                <button class="ff-btn ff-btn--primary" type="button" style="margin-top:1rem;" @click="makeReservation">Book</button>
            </div>
        </section>
    </div>
`,
    methods: {
        showMakeReservation : function(term){
            this.choosenOfferTerm = term;
            this.showPage = 1;
        },
        makeReservation : function(){
            this.dto.termId = this.choosenOfferTerm.id;
            this.dto.offerId = this.choosenOfferTerm.offer.id;
            this.dto.duration = this.filterDto.duration;
            this.dto.startDate = this.filterDto.start;
            this.dto.numberOfPeople = this.filterDto.numberOfPeople;

            var checkboxes = document.getElementsByName('addService');
              var checkboxesChecked = "";
              for (var i=0; i<checkboxes.length; i++) {
                 if (checkboxes[i].checked) {
                    checkboxesChecked = checkboxesChecked + " " + checkboxes[i].id;
                 }
              }
            this.dto.additionalServices = checkboxesChecked;
            axios.defaults.headers.common["Authorization"] =
                                         localStorage.getItem("user");
            axios.post("/api/makeReservation", this.dto)
                 .then((response) => {
                    if(response.data){
                        Swal.fire('Reservation made successfully!', '', 'success')
                    }else{
                        Swal.fire('Something went wrong!', 'Please try again later.', 'error')
                    }
                 })
                 .catch(() => Swal.fire('Something went wrong!', 'Please try again later.', 'error'))
        },
        filterTerms : function(){
            if(/\S/.test(this.filterDto.start) && /\S/.test(this.filterDto.duration) && /\S/.test(this.filterDto.numberOfPeople)){
                let start = new Date(this.filterDto.start);
                let today = new Date();
                if(start >= today){
                    axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
                    axios.post("/api/filterAvailableTerms", this.filterDto)
                         .then((response) =>{
                            this.allTerms = response.data || [];
                            this.choosenOfferTerm = this.allTerms[0] || this.choosenOfferTerm;
                         })
                         .catch(() => Swal.fire('Search failed!', 'Please try again later.', 'error'))
                }else{
                    Swal.fire('Date cannot be in the past!', '', 'error')
                }
            }else{
                    Swal.fire('Please fill all fields!', '', 'error')
            }
        }
    }
});
