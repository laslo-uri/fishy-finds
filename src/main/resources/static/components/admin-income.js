Vue.component('admin-income', {
	data: function(){
		return{
			systemCut: 0,
			newPercentage: "",
			incomeReport: {
				totalIncome: 0,
				systemIncome: 0,
				ownerIncome: 0,
				reservationsCount: 0
			}
		}
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>System income</h2>
					<p>Platform cut and aggregated reservation income.</p>
				</div>
				<div class="ff-detail">
					<div class="ff-detail__grid">
						<div class="ff-detail__wide"><span>Current system cut</span><strong>{{ systemCut }}%</strong></div>
					</div>
					<div class="ff-filters" style="margin-top:1rem;">
						<div class="ff-filters__row ff-filters__row--tight">
							<label class="ff-control">
								<span>New system cut (%)</span>
								<input type="number" class="ff-field" placeholder="e.g. 10" v-model="newPercentage" min="0" max="100" />
							</label>
							<div class="ff-filters__actions">
								<button type="button" class="ff-btn ff-btn--primary" @click="setSystemCut">Update cut</button>
							</div>
						</div>
					</div>
				</div>
				<div class="ff-detail" style="margin-top:1.25rem;">
					<h3 class="ff-detail__title">Income report</h3>
					<div class="ff-detail__grid">
						<div><span>Total income</span><strong>{{ incomeReport.totalIncome }} $</strong></div>
						<div><span>System income</span><strong>{{ incomeReport.systemIncome }} $</strong></div>
						<div><span>Owner income</span><strong>{{ incomeReport.ownerIncome }} $</strong></div>
						<div><span>Reservations</span><strong>{{ incomeReport.reservationsCount }}</strong></div>
					</div>
				</div>
			</section>
		</div>
	`,
	methods: {
		normalizeIncome: function(data){
			data = data || {};
			return {
				totalIncome: data.totalIncome != null ? data.totalIncome : (data.income != null ? data.income : 0),
				systemIncome: data.systemIncome != null ? data.systemIncome : (data.systemCutIncome != null ? data.systemCutIncome : 0),
				ownerIncome: data.ownerIncome != null ? data.ownerIncome : 0,
				reservationsCount: data.reservationsCount != null ? data.reservationsCount : (data.count != null ? data.count : 0)
			};
		},
		loadIncome: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var self = this;
			axios.get('/api/adminIncome')
				.then(function(response){
					var data = response.data || {};
					if (data.percentage != null) {
						self.systemCut = data.percentage;
					} else if (data.systemCut != null) {
						self.systemCut = data.systemCut;
					}
					self.incomeReport = self.normalizeIncome(data);
				})
				.catch(function(){
					self.incomeReport = self.normalizeIncome({});
				});
		},
		setSystemCut: function(){
			if (this.newPercentage === "" || this.newPercentage == null) {
				Swal.fire('Missing value!', 'Please enter a percentage.', 'error');
				return;
			}
			var percentage = Number(this.newPercentage);
			if (isNaN(percentage) || percentage < 0 || percentage > 100) {
				Swal.fire('Invalid percentage!', 'Enter a value between 0 and 100.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var self = this;
			axios.post('/api/setSystemCut', { percentage: percentage })
				.then(function(response){
					if (response.data === true || response.status === 200) {
						Swal.fire('System cut updated!', 'New percentage: ' + percentage + '%', 'success');
						self.systemCut = percentage;
						self.newPercentage = "";
						self.loadIncome();
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
		this.loadIncome();
	}
});
