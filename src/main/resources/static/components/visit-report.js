Vue.component('visit-report', {
	data: function(){
		return{
			form: {
				reservationId: "",
				comment: "",
				requestPenal: false,
				noShow: false
			},
			reservations: []
		}
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Submit visit report</h2>
					<p>Record comments, no-shows, and penalty requests for a reservation.</p>
				</div>
				<div class="ff-detail">
					<div class="ff-form-grid">
						<select class="ff-field" v-model="form.reservationId">
							<option disabled value="">Select reservation</option>
							<option v-for="r in reservations" :key="r.id" :value="r.id">
								#{{ r.id }} - {{ reservationLabel(r) }}
							</option>
						</select>
						<input type="number" class="ff-field" placeholder="Or enter reservation ID" v-model="form.reservationId" />
						<textarea class="ff-field ff-field--wide" rows="5" placeholder="Comment" v-model="form.comment"></textarea>
						<label class="ff-field--wide">
							<input type="checkbox" v-model="form.requestPenal" /> Request penalty
						</label>
						<label class="ff-field--wide">
							<input type="checkbox" v-model="form.noShow" /> No-show
						</label>
					</div>
					<div class="ff-detail__toolbar" style="margin-top:1rem;">
						<button type="button" class="ff-btn ff-btn--primary" @click="submitReport">Submit report</button>
					</div>
				</div>
			</section>
		</div>
	`,
	methods: {
		reservationLabel: function(r){
			var offer = r.offerName || (r.offer && r.offer.offerName) || 'Reservation';
			var start = r.startDate || r.startTime || '';
			return offer + (start ? (' (' + String(start).replace('T', ' ').substring(0, 16) + ')') : '');
		},
		loadReservations: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/ownerReservations')
				.then(response => {
					this.reservations = response.data || [];
				})
				.catch(() => {
					this.reservations = [];
				});
		},
		submitReport: function(){
			if (!this.form.reservationId) {
				Swal.fire('Missing reservation!', 'Please select or enter a reservation ID.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				reservationId: this.form.reservationId,
				comment: this.form.comment,
				requestPenal: this.form.requestPenal,
				noShow: this.form.noShow
			};
			var self = this;
			axios.post('/api/submitVisitReport', payload)
				.then(function(response){
					if (response.data === true || response.status === 200) {
						Swal.fire('Report submitted!', 'Your visit report was saved successfully.', 'success');
						self.form = { reservationId: "", comment: "", requestPenal: false, noShow: false };
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
		this.loadReservations();
	}
});
