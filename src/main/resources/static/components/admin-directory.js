Vue.component('admin-directory', {
	data: function(){
		return {
			tab: 'users',
			users: [],
			offers: []
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Admin directory</h2>
					<p>Browse users and offers. Soft-delete accounts or remove offers when allowed.</p>
				</div>

				<div class="ff-filters">
					<div class="ff-segment" role="group" aria-label="Directory tabs">
						<button type="button" class="ff-btn" :class="tab === 'users' ? 'ff-btn--primary' : 'ff-btn--ink'" @click="switchTab('users')">Users</button>
						<button type="button" class="ff-btn" :class="tab === 'offers' ? 'ff-btn--primary' : 'ff-btn--ink'" @click="switchTab('offers')">Offers</button>
					</div>
				</div>

				<div v-show="tab === 'users'">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="user in users" :key="user.id">
							<div class="ff-product__body">
								<h3>{{ fullName(user) || user.email }}</h3>
								<p class="ff-product__meta">{{ user.email }}</p>
								<p class="ff-product__meta">Type: {{ user.userType || '—' }}</p>
								<p class="ff-product__meta">Activated: {{ isActivated(user) ? 'Yes' : 'No' }} · Deleted: {{ isDeleted(user) ? 'Yes' : 'No' }}</p>
								<div class="ff-product__actions" v-if="!isDeleted(user)">
									<button type="button" class="ff-btn ff-btn--ink" @click="deleteUser(user)">Soft delete</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!users.length" class="ff-empty">No users found.</p>
				</div>

				<div v-show="tab === 'offers'">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="offer in offers" :key="offer.id">
							<div class="ff-product__body">
								<h3>{{ offer.offerName }}</h3>
								<p class="ff-product__meta">Type: {{ offer.offerType || '—' }}</p>
								<p class="ff-product__meta">Owner: {{ (offer.user && offer.user.email) || '—' }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--ink" @click="deleteOffer(offer)">Delete offer</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!offers.length" class="ff-empty">No offers found.</p>
				</div>
			</section>
		</div>
	`,
	methods: {
		auth: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
		},
		fullName: function(user){
			if (!user) return '';
			return ((user.firstName || '') + ' ' + (user.lastName || '')).trim();
		},
		isDeleted: function(user){
			return !!(user && (user.isDeleted || user.deleted));
		},
		isActivated: function(user){
			if (!user) return false;
			if (user.isActivated != null) return !!user.isActivated;
			if (user.activated != null) return !!user.activated;
			return false;
		},
		switchTab: function(tab){
			this.tab = tab;
			if (tab === 'users') this.loadUsers();
			else this.loadOffers();
		},
		loadUsers: function(){
			this.auth();
			var self = this;
			axios.get('/api/allUsers')
				.then(function(response){
					self.users = response.data || [];
				})
				.catch(function(){
					self.users = [];
					Swal.fire('Something went wrong!', 'Could not load users.', 'error');
				});
		},
		loadOffers: function(){
			this.auth();
			var self = this;
			axios.get('/api/allOffersAdmin')
				.then(function(response){
					self.offers = response.data || [];
				})
				.catch(function(){
					self.offers = [];
					Swal.fire('Something went wrong!', 'Could not load offers.', 'error');
				});
		},
		deleteUser: function(user){
			if (!user || this.isDeleted(user)) return;
			var self = this;
			Swal.fire({
				title: 'Soft delete this user?',
				text: user.email || ('User #' + user.id),
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Confirm'
			}).then(function(result){
				if (!result.isConfirmed) return;
				self.auth();
				axios.post('/api/deleteUser', { id: String(user.id) })
					.then(function(response){
						if (response.data === true) {
							Swal.fire('User deleted!', '', 'success');
							self.loadUsers();
						} else {
							Swal.fire('Something went wrong!', 'Please try again later.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					});
			});
		},
		deleteOffer: function(offer){
			if (!offer) return;
			var self = this;
			Swal.fire({
				title: 'Delete this offer?',
				text: 'Delete fails if the offer has an active reservation.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Confirm'
			}).then(function(result){
				if (!result.isConfirmed) return;
				self.auth();
				axios.post('/api/deleteOffer', { id: String(offer.id) })
					.then(function(response){
						if (response.data === true) {
							Swal.fire('Offer deleted!', '', 'success');
							self.loadOffers();
						} else {
							Swal.fire('Could not delete offer', 'It may have an active reservation.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Could not delete offer', 'It may have an active reservation.', 'error');
					});
			});
		}
	},
	mounted(){
		this.loadUsers();
	}
});
