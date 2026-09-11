Vue.component('admin-reviews', {
	data: function(){
		return {
			showPage: 0,
			feedbacks: [],
			selected: null
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Pending reviews</h2>
					<p>Accept or decline customer feedback before it becomes public.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-product-grid">
						<article class="ff-product" v-for="feedback in feedbacks" :key="feedback.id">
							<div class="ff-product__body">
								<h3>{{ offerName(feedback) || ('Feedback #' + feedback.id) }}</h3>
								<p class="ff-product__meta">Offer rating: {{ feedback.rateOffer }} · Owner rating: {{ feedback.rateOwner }}</p>
								<p>{{ feedback.contentForOffer || feedback.contentForOwner || 'No content.' }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showMore(feedback)">Review</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!feedbacks.length" class="ff-empty">No pending reviews.</p>
				</div>

				<div v-show="showPage == 1 && selected">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backToList">Close</button>
						</div>
						<h3 class="ff-detail__title">{{ offerName(selected) || ('Feedback #' + selected.id) }}</h3>
						<div class="ff-detail__grid">
							<div><span>Offer rating</span><strong>{{ selected.rateOffer }}</strong></div>
							<div><span>Owner rating</span><strong>{{ selected.rateOwner }}</strong></div>
						</div>
						<div class="ff-form-grid" style="margin-top:1rem;">
							<textarea rows="3" class="ff-field ff-field--wide" placeholder="Content for offer" :value="selected.contentForOffer" readonly></textarea>
							<textarea rows="3" class="ff-field ff-field--wide" placeholder="Content for owner" :value="selected.contentForOwner" readonly></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="acceptFeedback">Accept</button>
							<button type="button" class="ff-btn ff-btn--ink" @click="declineFeedback">Decline</button>
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
		offerName: function(feedback){
			if (!feedback || !feedback.reservation || !feedback.reservation.offer) return '';
			return feedback.reservation.offer.offerName || '';
		},
		loadFeedbacks: function(){
			this.auth();
			var self = this;
			axios.get('/api/allPendingFeedbacks')
				.then(function(response){
					self.feedbacks = response.data || [];
				})
				.catch(function(){
					self.feedbacks = [];
					Swal.fire('Something went wrong!', 'Could not load reviews.', 'error');
				});
		},
		showMore: function(feedback){
			this.selected = feedback;
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
							self.loadFeedbacks();
						} else {
							Swal.fire('Something went wrong!', 'Please try again later.', 'error');
						}
					})
					.catch(function(){
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					});
			});
		},
		acceptFeedback: function(){
			this.resolve('/api/acceptFeedback', 'Review accepted!');
		},
		declineFeedback: function(){
			this.resolve('/api/declineFeedback', 'Review declined!');
		}
	},
	mounted(){
		this.loadFeedbacks();
	}
});
