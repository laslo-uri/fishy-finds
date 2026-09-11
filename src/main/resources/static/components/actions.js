Vue.component('actions', {
data: function(){
    		return{
    		    offerId: '',
    		    loggedUser: {
                   userType:''
                },
    			sortOption: "",
    			reservations:[],
    		}
    	},
    template: `
    	<div class="ff-catalog">
    		<nav-bar></nav-bar>
            <section class="ff-catalog__shell">
                <div class="ff-section-head">
                    <h2>Special actions</h2>
                    <p>Discounted terms for this offer. Customers can book directly.</p>
                </div>
                <div class="ff-filters">
                    <div class="ff-filters__row ff-filters__row--tight">
                        <label class="ff-control">
                            <span>Sort actions</span>
                            <select v-model="sortOption" class="ff-field" @change="sortedArray">
                                <option disabled value="">Choose order</option>
                                <option value="AscPrice">Total price up</option>
                                <option value="DescPrice">Total price down</option>
                                <option value="AscDuration">Duration up</option>
                                <option value="DescDuration">Duration down</option>
                                <option value="AscStart">Start up</option>
                                <option value="DescStart">Start down</option>
                                <option value="AscEnd">End up</option>
                                <option value="DescEnd">End down</option>
                            </select>
                        </label>
                    </div>
                    <p class="ff-filters__hint">Sorting applies immediately when you pick an option.</p>
                </div>
                <div class="ff-product-grid">
                    <article class="ff-product" v-for="reservation in reservations" :key="reservation.id">
                        <div class="ff-product__media">
                            <img :src="reservation.path || 'images/no-pictures.jpg'" :alt="reservation.offer && reservation.offer.offerName">
                        </div>
                        <div class="ff-product__body">
                            <h3>{{ reservation.offer && reservation.offer.offerName }}</h3>
                            <p class="ff-product__meta">{{ reservation.startDate }} - {{ reservation.endDate }}</p>
                            <p>{{ reservation.offer && reservation.offer.description }}</p>
                            <p class="ff-product__meta">People: {{ reservation.numberOfPeople }} | Total: {{ reservation.totalPrice }} | Discount: {{ reservation.discount }}</p>
                            <div class="ff-product__actions" v-if="loggedUser.userType == 'CUSTOMER'">
                                <button class="ff-btn ff-btn--primary" type="button" @click="makeReservation(reservation)">Book</button>
                            </div>
                        </div>
                    </article>
                </div>
                <p v-if="!reservations.length" class="ff-empty">No special actions for this offer.</p>
            </section>
    	</div>
    		`
          ,
          methods : {
            reloadActions : function(){
                axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
                axios.post("/api/getActionsForOffer", {"id" : this.offerId})
                     .then((response) => { this.reservations = response.data || []; });
            },
            makeReservation : function(reservation){
            axios.defaults.headers.common["Authorization"] =
                           localStorage.getItem("user");
                axios.post("/api/makeReservationAction",{"id" : reservation.id})
                     .then((response)=>{
                        if(response.data){
                           Swal.fire('Booked successfully!', '', 'success');
                           this.reloadActions();
                        }else{
                            Swal.fire('Something went wrong!', 'Please try again later.', 'error')
                        }
                     })
                     .catch(() => Swal.fire('Something went wrong!', 'Please try again later.', 'error'))
            },
            sortedArray: function() {
                    if(this.sortOption === 'DescPrice'){
                       return this.reservations.sort((a, b) => b.totalPrice - a.totalPrice);
                   }
                    if(this.sortOption === 'AscPrice'){
                        return this.reservations.sort((a, b) => a.totalPrice - b.totalPrice);
                    }
                    if(this.sortOption === 'DescDuration'){
                       return this.reservations.sort((a, b) => b.duration - a.duration);
                   }
                    if(this.sortOption === 'AscDuration'){
                        return this.reservations.sort((a, b) => a.duration - b.duration);
                    }
                    if(this.sortOption === 'DescStart'){
                       return this.reservations.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
                   }
                    if(this.sortOption === 'AscStart'){
                        return this.reservations.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
                    }
                    if(this.sortOption === 'DescEnd'){
                       return this.reservations.sort((a, b) => (a.endDate < b.endDate ? 1 : -1));
                   }
                    if(this.sortOption === 'AscEnd'){
                        return this.reservations.sort((a, b) => (a.endDate > b.endDate ? 1 : -1));
                    }
             }
          },
        mounted(){
            this.offerId = (this.$route && this.$route.params && this.$route.params.id)
                || (window.location.pathname.split('/').filter(Boolean).pop());
            this.reloadActions();
            axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
            axios.get("/api/authenticateUser")
                 .then(response => this.loggedUser = response.data || { userType: '' })
                 .catch(() => this.loggedUser = { userType: '' });
        }

});
