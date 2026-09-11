Vue.component('following', {
	data: function(){
		return{
            offers: [],
            copyOfOffers: [],
            sortOption: "",
            searchName: "",
            filterOptions: "noFilter"
		}
	},
template: `
		<div class="ff-catalog">
            <nav-bar></nav-bar>
            <section class="ff-catalog__shell">
                <div class="ff-section-head">
                    <h2>Following</h2>
                    <p>Offers you follow - search, sort, and filter by type.</p>
                </div>
                <div class="ff-filters">
                    <div class="ff-filters__row">
                        <label class="ff-control">
                            <span>Offer name</span>
                            <input v-model="searchName" class="ff-field" type="text" placeholder="Search followed offers" />
                        </label>
                        <label class="ff-control">
                            <span>Sort results</span>
                            <select class="ff-field" v-model="sortOption" @change="sortedArray">
                                <option disabled value="">Choose order</option>
                                <option value="AscAlpha">Name A-Z</option>
                                <option value="DescAlpha">Name Z-A</option>
                                <option value="AscRating">Rating up</option>
                                <option value="DescRating">Rating down</option>
                                <option value="AscPrice">Price up</option>
                                <option value="DescPrice">Price down</option>
                            </select>
                        </label>
                        <label class="ff-control">
                            <span>Type</span>
                            <select class="ff-field" v-model="filterOptions" @change="filterArray">
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
                    <p class="ff-filters__hint">Sort and type filter apply as soon as you change them.</p>
                </div>
                <div class="ff-product-grid">
                    <article class="ff-product" v-for="o in offers" :key="o.offer.id">
                        <div class="ff-product__media">
                            <img :src="o.path || 'images/no-pictures.jpg'" :alt="o.offer.offerName">
                        </div>
                        <div class="ff-product__body">
                            <h3>{{ o.offer.offerName }}</h3>
                            <p class="ff-product__meta">{{ o.offer.unitPrice }} | * {{ o.offer.rating }}</p>
                            <p>{{ o.offer.description }}</p>
                            <div class="ff-product__actions">
                                <button v-show="o.followed" class="ff-btn ff-btn--ink" type="button" @click="follow(o.offer)">Unfollow</button>
                            </div>
                        </div>
                    </article>
                </div>
                <p v-if="!offers.length" class="ff-empty">You are not following any offers yet.</p>
            </section>
		</div>
		`
        ,
        methods : {
            follow : function(offer){
                axios.defaults.headers.common["Authorization"] =
                                      localStorage.getItem("user");
                axios.post("/api/addFollower", {"id" : offer.id})
                     .then(response => {
                          axios.defaults.headers.common["Authorization"] =
                                                 localStorage.getItem("user");
                          axios.get("/api/getSubscriptionsByUser")
                               .then(response => {
                                     this.offers = response.data;
                                     this.copyOfOffers = response.data;
                               })
                          });
            },
            filterArray: function(){
                if(this.filterOptions === "noFilter"){
                    this.offers = this.copyOfOffers;
                }else{
                    this.offers = this.copyOfOffers;
                    let newArray = this.offers.filter(el => {
                        return el.offer.offerType === this.filterOptions;
                    })
                    this.offers = newArray;
                }
            },
            search: function(){
                this.offers = this.copyOfOffers;
                let newArray = this.offers.filter(el => {
                    let text = this.searchName;
                    return el.offer.offerName.toLowerCase().includes(text);
                })
                this.offers = newArray;
                if(this.searchName === "")
                    this.offers = this.copyOfOffers;
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
                       return this.offers.sort(compare);
                   }
                    if(this.sortOption === 'AscAlpha'){
                        function compare(a, b) {
                            if (a.offer.offerName < b.offer.offerName)
                               return -1;
                            if (a.offer.offerName > b.offer.offerName)
                               return 1;
                            return 0;
                        }
                        return this.offers.sort(compare);
                    }
                    if(this.sortOption === 'DescRating'){
                       function compare(a, b) {
                         if (a.offer.rating > b.offer.rating)
                           return -1;
                         if (a.offer.rating < b.offer.rating)
                           return 1;
                        return 0;
                      }
                       return this.offers.sort(compare);
                   }
                    if(this.sortOption === 'AscRating'){
                        function compare(a, b) {
                            if (a.offer.rating < b.offer.rating)
                               return -1;
                            if (a.offer.rating > b.offer.rating)
                               return 1;
                            return 0;
                        }
                        return this.offers.sort(compare);
                    }
                    if(this.sortOption === 'DescPrice'){
                       function compare(a, b) {
                         if (a.offer.unitPrice > b.offer.unitPrice)
                           return -1;
                         if (a.offer.unitPrice < b.offer.unitPrice)
                           return 1;
                        return 0;
                      }
                       return this.offers.sort(compare);
                   }
                    if(this.sortOption === 'AscPrice'){
                        function compare(a, b) {
                            if (a.offer.unitPrice < b.offer.unitPrice)
                               return -1;
                            if (a.offer.unitPrice > b.offer.unitPrice)
                               return 1;
                            return 0;
                        }
                        return this.offers.sort(compare);
                    }
             }
        },
        mounted(){
             axios.defaults.headers.common["Authorization"] =
                                    localStorage.getItem("user");
             axios.get("/api/getSubscriptionsByUser")
                  .then(response => {
                      this.offers = response.data;
                      this.copyOfOffers = response.data
                  })
        }
});