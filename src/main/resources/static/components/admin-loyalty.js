Vue.component('admin-loyalty', {
	data: function(){
		return{
			loyalties: [],
			form: {
				categoryName: "",
				requiredPoints: "",
				categoryDiscount: "",
				earningRate: ""
			}
		}
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Loyalty categories</h2>
					<p>Define point thresholds, discounts, and earning rates.</p>
				</div>
				<div class="ff-detail">
					<div class="ff-form-grid">
						<input type="text" class="ff-field" placeholder="Category name" v-model="form.categoryName" />
						<input type="number" class="ff-field" placeholder="Required points" v-model="form.requiredPoints" />
						<input type="number" class="ff-field" placeholder="Category discount (%)" v-model="form.categoryDiscount" />
						<input type="number" class="ff-field" placeholder="Earning rate" v-model="form.earningRate" />
					</div>
					<div class="ff-detail__toolbar" style="margin-top:1rem;">
						<button type="button" class="ff-btn ff-btn--primary" @click="addCategory">Add category</button>
					</div>
				</div>
				<div class="ff-product-grid" style="margin-top:1.5rem;">
					<article class="ff-product" v-for="l in loyalties" :key="l.id">
						<div class="ff-product__body">
							<h3>{{ l.categoryName }}</h3>
							<p class="ff-product__meta">Required points: {{ l.requiredPoints }}</p>
							<p class="ff-product__meta">Discount: {{ l.categoryDiscount }}%</p>
							<p class="ff-product__meta">Earning rate: {{ l.earningRate }}</p>
							<div class="ff-product__actions">
								<button type="button" class="ff-btn ff-btn--ink" @click="deleteCategory(l)">Delete category</button>
							</div>
						</div>
					</article>
				</div>
				<p v-if="!loyalties.length" class="ff-empty">No loyalty categories yet.</p>
			</section>
		</div>
	`,
	methods: {
		loadLoyalties: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/getAllLoyaltyCategories')
				.then(response => {
					this.loyalties = response.data || [];
				});
		},
		addCategory: function(){
			if (!this.form.categoryName || this.form.requiredPoints === "" || this.form.categoryDiscount === "" || this.form.earningRate === "") {
				Swal.fire('Please fill the form properly!', 'All fields are required.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				categoryName: this.form.categoryName,
				requiredPoints: String(this.form.requiredPoints),
				categoryDiscount: String(this.form.categoryDiscount),
				earningRate: String(this.form.earningRate)
			};
			var self = this;
			axios.post('/api/addNewLoyaltyCategory', payload)
				.then(function(response){
					if (response.data === true) {
						Swal.fire('Category added!', 'The loyalty category was created successfully.', 'success');
						self.form = { categoryName: "", requiredPoints: "", categoryDiscount: "", earningRate: "" };
						self.loadLoyalties();
					} else {
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					}
				})
				.catch(function(){
					Swal.fire('Something went wrong!', 'Please try again later.', 'error');
				});
		},
		deleteCategory: function(loyalty){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var self = this;
			axios.post('/api/deleteLoyaltyCategory', { id: String(loyalty.id) })
				.then(function(response){
					if (response.data === true) {
						Swal.fire('Category deleted!', 'The loyalty category was removed.', 'success');
						self.loadLoyalties();
					} else {
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					}
				})
				.catch(function(){
					Swal.fire('Something went wrong!', 'Please try again later.', 'error');
				});
		}
	},
	mounted(){
		this.loadLoyalties();
	}
});
