Vue.component('owner-reports', {
	data: function(){
		return{
			report: {
				averageRating: 0,
				income: 0,
				weeklyCount: 0,
				monthlyCount: 0,
				yearlyCount: 0
			},
			chartInstance: null
		}
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Owner reports</h2>
					<p>Rating, income, and reservation volume at a glance.</p>
				</div>
				<div class="ff-detail">
					<div class="ff-detail__grid">
						<div><span>Average rating</span><strong>{{ report.averageRating }}</strong></div>
						<div><span>Income</span><strong>{{ report.income }} $</strong></div>
						<div><span>Weekly reservations</span><strong>{{ report.weeklyCount }}</strong></div>
						<div><span>Monthly reservations</span><strong>{{ report.monthlyCount }}</strong></div>
						<div><span>Yearly reservations</span><strong>{{ report.yearlyCount }}</strong></div>
					</div>
				</div>
				<div class="ff-detail" style="margin-top:1.25rem;">
					<canvas id="ownerReportChart" height="200"></canvas>
				</div>
			</section>
		</div>
	`,
	methods: {
		normalizeReport: function(data){
			data = data || {};
			return {
				averageRating: data.averageRating != null ? data.averageRating : (data.avgRating != null ? data.avgRating : 0),
				income: data.income != null ? data.income : (data.totalIncome != null ? data.totalIncome : 0),
				weeklyCount: data.weeklyCount != null ? data.weeklyCount : (data.weekly != null ? data.weekly : 0),
				monthlyCount: data.monthlyCount != null ? data.monthlyCount : (data.monthly != null ? data.monthly : 0),
				yearlyCount: data.yearlyCount != null ? data.yearlyCount : (data.yearly != null ? data.yearly : 0)
			};
		},
		renderChart: function(){
			var canvas = document.getElementById('ownerReportChart');
			if (!canvas || typeof Chart === 'undefined') {
				return;
			}
			if (this.chartInstance) {
				this.chartInstance.destroy();
			}
			this.chartInstance = new Chart(canvas.getContext('2d'), {
				type: 'bar',
				data: {
					labels: ['Weekly', 'Monthly', 'Yearly'],
					datasets: [{
						label: 'Reservation count',
						data: [this.report.weeklyCount, this.report.monthlyCount, this.report.yearlyCount],
						backgroundColor: ['#ed1c24', '#1a1a1a', '#287f9a']
					}]
				},
				options: {
					responsive: true,
					plugins: {
						legend: { labels: { color: '#1a1a1a' } }
					},
					scales: {
						x: { ticks: { color: '#1a1a1a' }, grid: { color: 'rgba(0,0,0,0.06)' } },
						y: { beginAtZero: true, ticks: { color: '#1a1a1a' }, grid: { color: 'rgba(0,0,0,0.06)' } }
					}
				}
			});
		},
		loadReport: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var self = this;
			axios.get('/api/ownerReports')
				.then(function(response){
					self.report = self.normalizeReport(response.data);
					self.$nextTick(function(){
						self.renderChart();
					});
				})
				.catch(function(){
					self.report = self.normalizeReport({});
					self.$nextTick(function(){
						self.renderChart();
					});
				});
		}
	},
	mounted(){
		this.loadReport();
	},
	beforeDestroy(){
		if (this.chartInstance) {
			this.chartInstance.destroy();
		}
	}
});
