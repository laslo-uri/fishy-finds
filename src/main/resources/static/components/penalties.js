Vue.component('penalties', {
	data: function(){
		return{
			number: { number: 0 },
			show: false
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Penalties</h2>
					<p>Customers with more than 3 penalties cannot make new reservations.</p>
				</div>
				<div class="ff-detail">
					<div class="ff-detail__grid">
						<div class="ff-detail__wide"><span>Your penalty count</span><strong>{{ number.number }}</strong></div>
						<div class="ff-detail__wide"><span>Note</span><strong>Penalties are cleared every month.</strong></div>
					</div>
				</div>
			</section>
		</div>
	`,
	mounted(){
		axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
		axios.get("/api/getPenalForUser")
			.then(response => {
				this.number = response.data || { number: 0 };
			})
			.catch(() => { this.number = { number: 0 }; });
	}
});
