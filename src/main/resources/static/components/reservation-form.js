Vue.component('reservation-form', {
	data: function(){
		return{
			loaded: false,
			term: {
			    id: "",
			    offer: {
			        id: "",
			        offerName: "",
			        location: {
			            country: "",
			            city: "",
			            street: "",
			            streetNumber: ""
			        },
			        unitPrice: 0,
			        rating: "",
			        maxCustomerCapacity: "",
			        rulesOfConduct: "",
			        additionalServices: [],
			        cancellationPolicy: ""
			    },
			    startDate: "",
			    endDate: ""
			},
            dto: {
                termId : "",
                offerId : "",
                startDate : "",
                duration : "",
                numberOfPeople: "",
                additionalServices: ""
            }
		};
	},
template: `
	<div class="ff-catalog">
        <nav-bar></nav-bar>
        <section class="ff-catalog__shell">
            <div class="ff-section-head">
                <h2>Reservation form</h2>
                <p>Book an available term for this offer.</p>
            </div>
            <div class="ff-detail" v-if="loaded">
                <h3 class="ff-detail__title">{{ term.offer.offerName }}</h3>
                <div class="ff-detail__grid">
                    <div class="ff-detail__wide"><span>Available</span><strong>{{ term.startDate }} → {{ term.endDate }}</strong></div>
                    <div><span>Unit price</span><strong>{{ term.offer.unitPrice }}</strong></div>
                    <div><span>Capacity</span><strong>{{ term.offer.maxCustomerCapacity }}</strong></div>
                </div>
                <div class="ff-form-grid" style="margin-top:1rem;">
                    <input class="ff-field" type="datetime-local" v-model="dto.startDate" />
                    <input class="ff-field" type="number" min="1" v-model="dto.duration" placeholder="Duration (days)" />
                    <input class="ff-field" type="number" min="1" v-model="dto.numberOfPeople" :max="term.offer.maxCustomerCapacity" placeholder="Number of people" />
                </div>
                <div style="margin-top:1rem;" v-for="a in (term.offer.additionalServices || [])" :key="a.name || a.id">
                    <input type="checkbox" name="addService" :id="'svc-' + (a.name || a.id)" />
                    <label :for="'svc-' + (a.name || a.id)">{{ a.name }}</label>
                </div>
                <p style="margin-top:1rem;font-weight:700;">Total: {{ (dto.numberOfPeople || 0) * (term.offer.unitPrice || 0) }}</p>
                <button type="button" class="ff-btn ff-btn--primary" style="margin-top:0.75rem;" @click="makeReservation">Book</button>
            </div>
            <p v-else class="ff-empty">Loading term…</p>
        </section>
    </div>
`,
    methods: {
        makeReservation : function(){
            if(/\S/.test(this.dto.startDate) && /\S/.test(this.dto.duration) && /\S/.test(this.dto.numberOfPeople)){
                let start = new Date(this.dto.startDate);
                let startTerm = new Date(this.term.startDate);
                let endTerm = new Date(this.term.endDate);
                let newDate = moment(start, "DD-MM-YYYY").add(this.dto.duration, 'days');
                if(start >= startTerm && start <= endTerm && newDate._d >= startTerm && newDate <= endTerm){
                    this.dto.termId = this.term.id;
                    this.dto.offerId = this.term.offer.id;
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
                }else{
                Swal.fire('Please check the dates!', '', 'error')
                }
            }else{
                Swal.fire('Please fill all fields!', '', 'error')
            }
        }
    },
    mounted(){
     const id = (this.$route && this.$route.params && this.$route.params.id)
          || (window.location.pathname.split('/').filter(Boolean).pop());
     axios.defaults.headers.common["Authorization"] =
                            localStorage.getItem("user");
     axios.post("/api/getTermById", {"id" : id})
          .then(response => {
            if (response.data && response.data.offer) {
                this.term = response.data;
                if (!this.term.offer.additionalServices) this.term.offer.additionalServices = [];
                this.loaded = true;
            } else {
                Swal.fire('Term not found', '', 'error');
            }
          })
          .catch(() => Swal.fire('Could not load term', '', 'error'));
    }
});
