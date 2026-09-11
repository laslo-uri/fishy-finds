Vue.component('admin-registrations', {
	data: function(){
		return {
			showPage: 0,
			showDeny: false,
			requests: [],
			selected: null,
			denyExplanation: ""
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Pending registrations</h2>
					<p>Approve or deny advertiser account creation requests.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="request in requests" :key="request.id">
							<div class="ff-product__body">
								<h3>{{ displayName(request) }}</h3>
								<p class="ff-product__meta">{{ request.user && request.user.email }}</p>
								<p>{{ request.explanation || 'No explanation provided.' }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showMore(request)">Review</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!requests.length" class="ff-empty">No pending registration requests.</p>
				</div>

				<div v-show="showPage == 1 && selected">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backToList">Close</button>
						</div>
						<h3 class="ff-detail__title">Registration request #{{ selected.id }}</h3>
						<div class="ff-form-grid">
							<input type="text" class="ff-field" placeholder="First name" :value="selected.user && selected.user.firstName" readonly />
							<input type="text" class="ff-field" placeholder="Last name" :value="selected.user && selected.user.lastName" readonly />
							<input type="text" class="ff-field ff-field--wide" placeholder="Email" :value="selected.user && selected.user.email" readonly />
							<textarea rows="4" class="ff-field ff-field--wide" placeholder="Explanation" :value="selected.explanation" readonly></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="approveRequest">Approve</button>
							<button type="button" class="ff-btn ff-btn--ink" @click="showDeny = true">Deny</button>
						</div>
						<div v-show="showDeny" style="margin-top:1rem;">
							<textarea rows="4" class="ff-field ff-field--wide" placeholder="Reason for rejection" v-model="denyExplanation"></textarea>
							<div class="ff-detail__toolbar" style="margin-top:0.75rem;">
								<button type="button" class="ff-btn ff-btn--primary" @click="denyRequest">Confirm deny</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	`,
	methods: {
		auth: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
		},
		displayName: function(request){
			var user = request && request.user;
			if (!user) return 'Request #' + (request && request.id);
			var name = ((user.firstName || '') + ' ' + (user.lastName || '')).trim();
			return name || user.email || ('Request #' + request.id);
		},
		loadRequests: function(){
			this.auth();
			var self = this;
			axios.get('/api/getAllCreationPendingRequests')
				.then(function(response){
					self.requests = response.data || [];
				})
				.catch(function(){
					self.requests = [];
					Swal.fire('Something went wrong!', 'Could not load registration requests.', 'error');
				});
		},
		showMore: function(request){
			this.selected = request;
			this.denyExplanation = "";
			this.showDeny = false;
			this.showPage = 1;
		},
		backToList: function(){
			this.showPage = 0;
			this.selected = null;
			this.showDeny = false;
			this.denyExplanation = "";
		},
		approveRequest: function(){
			if (!this.selected) return;
			var self = this;
			var requestId = this.selected.id;
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Confirm'
			}).then(function(result){
				if (!result.isConfirmed) return;
				self.auth();
				axios.post('/api/approveCreationRequest', { requestId: String(requestId) })
					.then(function(response){
						if (response.data === true) {
							Swal.fire('Registration approved!', '', 'success');
							self.backToList();
							self.loadRequests();
						} else {
							Swal.fire('Something went wrong!', 'Please try again later.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					});
			});
		},
		denyRequest: function(){
			if (!this.selected) return;
			if (!this.denyExplanation || !/\S/.test(this.denyExplanation)) {
				Swal.fire('Blank space', 'Please fill in the required fields.', 'error');
				return;
			}
			var self = this;
			var userId = this.selected.user && this.selected.user.id;
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Confirm'
			}).then(function(result){
				if (!result.isConfirmed) return;
				self.auth();
				axios.post('/api/denyCreationRequest', {
					requestId: String(self.selected.id),
					id: String(userId),
					explanation: self.denyExplanation
				})
					.then(function(response){
						if (response.data === true) {
							Swal.fire('Registration denied!', '', 'success');
							self.backToList();
							self.loadRequests();
						} else {
							Swal.fire('Something went wrong!', 'Please try again later.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					});
			});
		}
	},
	mounted(){
		this.loadRequests();
	}
});
