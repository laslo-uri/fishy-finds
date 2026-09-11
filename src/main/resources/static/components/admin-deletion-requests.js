Vue.component('admin-deletion-requests', {
	data: function(){
		return {
			showPage: 0,
			showDeny: false,
			requests: [],
			requestToShow: {
				id: null,
				explanation: '',
				firstName: '',
				lastName: '',
				email: ''
			},
			deny: {
				requestId: null,
				id: null,
				explanation: ''
			}
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>User deletion requests</h2>
					<p>Review pending account deletion requests and approve or deny them.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="request in requests" :key="request.id">
							<div class="ff-product__body">
								<h3>Request #{{ request.id }}</h3>
								<p>{{ request.explanation }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showMore(request)">Show more</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!requests.length" class="ff-empty">No pending deletion requests.</p>
				</div>

				<div v-show="showPage == 1">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backToList">Close</button>
						</div>
						<h3 class="ff-detail__title">Request details</h3>
						<div class="ff-form-grid">
							<input type="text" placeholder="First name" class="ff-field" v-model="requestToShow.firstName" readonly />
							<input type="text" placeholder="Last name" class="ff-field" v-model="requestToShow.lastName" readonly />
							<input type="text" placeholder="Email" class="ff-field ff-field--wide" v-model="requestToShow.email" readonly />
							<textarea rows="4" placeholder="Explanation" class="ff-field ff-field--wide" v-model="requestToShow.explanation" readonly></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="approveRequest">Approve request</button>
							<button type="button" class="ff-btn ff-btn--ink" @click="showDeny = true">Deny request</button>
						</div>
						<div v-show="showDeny" style="margin-top:1rem;">
							<textarea rows="4" placeholder="Reasoning for rejection" class="ff-field ff-field--wide" v-model="deny.explanation"></textarea>
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
		loadRequests: function(){
			this.auth();
			var self = this;
			axios.get('/api/allPendingDeletionRequests')
				.then(function(response){
					self.requests = response.data || [];
				})
				.catch(function(){
					self.requests = [];
					Swal.fire('Something went wrong!', 'Could not load deletion requests.', 'error');
				});
		},
		backToList: function(){
			this.showPage = 0;
			this.showDeny = false;
			this.deny.explanation = '';
		},
		showMore: function(request){
			var self = this;
			this.showPage = 1;
			this.showDeny = false;
			this.requestToShow.id = request.id;
			this.requestToShow.explanation = request.explanation || '';
			this.requestToShow.firstName = '';
			this.requestToShow.lastName = '';
			this.requestToShow.email = '';
			this.deny.id = request.user && request.user.id;
			this.deny.requestId = request.id;
			this.deny.explanation = '';

			this.auth();
			axios.get('/api/findUser', { params: { id: this.deny.id } })
				.then(function(response){
					var dto = response.data || {};
					self.requestToShow.firstName = dto.firstName || '';
					self.requestToShow.lastName = dto.lastName || '';
					self.requestToShow.email = dto.email || '';
				})
				.catch(function(){
					Swal.fire('Something went wrong!', 'Could not load user details.', 'error');
				});
		},
		approveRequest: function(){
			var self = this;
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
				axios.post('/api/approveDeleteRequest', {
					requestId: String(self.deny.requestId),
					id: String(self.deny.id),
					explanation: self.deny.explanation || ''
				})
					.then(function(response){
						if (response.data === true) {
							Swal.fire('Deletion request approved successfully!', '', 'success');
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
			if (!this.deny.explanation || !/\S/.test(this.deny.explanation)) {
				Swal.fire('Blank space', 'Please fill in the required fields.', 'error');
				return;
			}
			var self = this;
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
				axios.post('/api/denyDeleteRequest', {
					requestId: String(self.deny.requestId),
					id: String(self.deny.id),
					explanation: self.deny.explanation
				})
					.then(function(response){
						if (response.data === true) {
							Swal.fire('Deletion request denied successfully!', '', 'success');
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
