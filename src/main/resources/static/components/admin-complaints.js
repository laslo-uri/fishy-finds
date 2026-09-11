Vue.component('admin-complaints', {
	data: function(){
		return {
			showPage: 0,
			complaints: [],
			selected: null,
			reply: ""
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Pending complaints</h2>
					<p>Review complaints and send a reply when accepting or denying.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="complaint in complaints" :key="complaint.id">
							<div class="ff-product__body">
								<h3>Complaint #{{ complaint.id }}</h3>
								<p class="ff-product__meta">{{ complaint.complaintType || 'Complaint' }}</p>
								<p class="ff-product__meta" v-if="offerName(complaint)">Offer: {{ offerName(complaint) }}</p>
								<p>{{ complaint.content }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showMore(complaint)">Review</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!complaints.length" class="ff-empty">No pending complaints.</p>
				</div>

				<div v-show="showPage == 1 && selected">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backToList">Close</button>
						</div>
						<h3 class="ff-detail__title">Complaint #{{ selected.id }}</h3>
						<div class="ff-detail__grid">
							<div><span>Type</span><strong>{{ selected.complaintType || '—' }}</strong></div>
							<div><span>Offer</span><strong>{{ offerName(selected) || '—' }}</strong></div>
						</div>
						<div class="ff-form-grid" style="margin-top:1rem;">
							<textarea rows="4" class="ff-field ff-field--wide" placeholder="Complaint content" :value="selected.content" readonly></textarea>
							<textarea rows="4" class="ff-field ff-field--wide" placeholder="Your reply (required)" v-model="reply"></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="acceptComplaint">Accept</button>
							<button type="button" class="ff-btn ff-btn--ink" @click="denyComplaint">Deny</button>
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
		offerName: function(complaint){
			if (!complaint || !complaint.reservation || !complaint.reservation.offer) return '';
			return complaint.reservation.offer.offerName || '';
		},
		loadComplaints: function(){
			this.auth();
			var self = this;
			axios.get('/api/allPendingComplaints')
				.then(function(response){
					self.complaints = response.data || [];
				})
				.catch(function(){
					self.complaints = [];
					Swal.fire('Something went wrong!', 'Could not load complaints.', 'error');
				});
		},
		showMore: function(complaint){
			this.selected = complaint;
			this.reply = "";
			this.showPage = 1;
		},
		backToList: function(){
			this.showPage = 0;
			this.selected = null;
			this.reply = "";
		},
		payload: function(){
			// Backend mapper requires parseable Longs for userId/offerId; emails use reservation.
			var reservation = this.selected && this.selected.reservation;
			var userId = reservation && reservation.customer && reservation.customer.id;
			var offerId = reservation && reservation.offer && reservation.offer.id;
			return {
				complaintId: String(this.selected.id),
				content: this.reply,
				userId: userId != null ? String(userId) : '0',
				offerId: offerId != null ? String(offerId) : '0'
			};
		},
		resolve: function(endpoint, successMessage){
			if (!this.selected) return;
			if (!this.reply || !/\S/.test(this.reply)) {
				Swal.fire('Blank space', 'Please enter a reply before continuing.', 'error');
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
				axios.post(endpoint, self.payload())
					.then(function(response){
						if (response.data === true) {
							Swal.fire(successMessage, '', 'success');
							self.backToList();
							self.loadComplaints();
						} else {
							Swal.fire('Something went wrong!', 'Please try again later.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					});
			});
		},
		acceptComplaint: function(){
			this.resolve('/api/acceptComplaint', 'Complaint accepted!');
		},
		denyComplaint: function(){
			this.resolve('/api/denyComplaint', 'Complaint denied!');
		}
	},
	mounted(){
		this.loadComplaints();
	}
});
