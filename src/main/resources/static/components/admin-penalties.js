Vue.component('admin-penalties', {
	data: function(){
		return {
			showPage: 0,
			reports: [],
			selected: null
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Penalty reports</h2>
					<p>Review no-show and penalty requests submitted by advertisers.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="report in reports" :key="report.id">
							<div class="ff-product__body">
								<h3>{{ offerName(report) || ('Report #' + report.id) }}</h3>
								<p class="ff-product__meta">Customer: {{ customerEmail(report) || '—' }}</p>
								<p class="ff-product__meta">Submitted by: {{ submittedBy(report) || '—' }}</p>
								<p class="ff-product__meta">No-show: {{ report.noShow ? 'Yes' : 'No' }} · Penal requested: {{ report.requestPenal ? 'Yes' : 'No' }}</p>
								<p>{{ report.comment || 'No comment.' }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showMore(report)">Review</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!reports.length" class="ff-empty">No pending penalty reports.</p>
				</div>

				<div v-show="showPage == 1 && selected">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backToList">Close</button>
						</div>
						<h3 class="ff-detail__title">{{ offerName(selected) || ('Report #' + selected.id) }}</h3>
						<div class="ff-detail__grid">
							<div><span>Customer</span><strong>{{ customerEmail(selected) || '—' }}</strong></div>
							<div><span>Submitted by</span><strong>{{ submittedBy(selected) || '—' }}</strong></div>
							<div><span>No-show</span><strong>{{ selected.noShow ? 'Yes' : 'No' }}</strong></div>
							<div><span>Penal requested</span><strong>{{ selected.requestPenal ? 'Yes' : 'No' }}</strong></div>
						</div>
						<div class="ff-form-grid" style="margin-top:1rem;">
							<textarea rows="4" class="ff-field ff-field--wide" placeholder="Comment" :value="selected.comment" readonly></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="approveReport">Approve</button>
							<button type="button" class="ff-btn ff-btn--ink" @click="declineReport">Decline</button>
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
		offerName: function(report){
			if (!report || !report.reservation || !report.reservation.offer) return '';
			return report.reservation.offer.offerName || '';
		},
		customerEmail: function(report){
			if (!report || !report.reservation || !report.reservation.customer) return '';
			return report.reservation.customer.email || '';
		},
		submittedBy: function(report){
			if (!report || !report.submittedBy) return '';
			var user = report.submittedBy;
			var name = ((user.firstName || '') + ' ' + (user.lastName || '')).trim();
			return name || user.email || '';
		},
		loadReports: function(){
			this.auth();
			var self = this;
			axios.get('/api/pendingPenalReports')
				.then(function(response){
					self.reports = response.data || [];
				})
				.catch(function(){
					self.reports = [];
					Swal.fire('Something went wrong!', 'Could not load penalty reports.', 'error');
				});
		},
		showMore: function(report){
			this.selected = report;
			this.showPage = 1;
		},
		backToList: function(){
			this.showPage = 0;
			this.selected = null;
		},
		resolve: function(endpoint, successMessage){
			if (!this.selected) return;
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
				axios.post(endpoint, { id: String(self.selected.id) })
					.then(function(response){
						if (response.data === true) {
							Swal.fire(successMessage, '', 'success');
							self.backToList();
							self.loadReports();
						} else {
							Swal.fire('Something went wrong!', 'Please try again later.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					});
			});
		},
		approveReport: function(){
			this.resolve('/api/approvePenalReport', 'Penalty report approved!');
		},
		declineReport: function(){
			this.resolve('/api/declinePenalReport', 'Penalty report declined!');
		}
	},
	mounted(){
		this.loadReports();
	}
});
