Vue.component('admin-reg-req-complaints', {
	data: function(){
		return {};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Admin dashboard</h2>
					<p>Manage registrations, complaints, reviews, penalties, and platform settings.</p>
				</div>
				<div class="ff-role-grid">
					<a class="ff-role-card" href="/admin/registrations" role="button">
						<img src="images/tile-registrations.png" alt="Registration forms">
						<strong>Registrations</strong>
						<span>Approve or deny pending advertiser registrations</span>
					</a>
					<a class="ff-role-card" href="/admin/complaints" role="button">
						<img src="images/tile-complaints.png" alt="Complaint correspondence">
						<strong>Complaints</strong>
						<span>Review and resolve customer complaints</span>
					</a>
					<a class="ff-role-card" href="/admin/reviews" role="button">
						<img src="images/tile-reviews.png" alt="Guest reviews">
						<strong>Reviews</strong>
						<span>Accept or decline pending feedback</span>
					</a>
					<a class="ff-role-card" href="/admin/deletion-requests" role="button">
						<img src="images/tile-deletion.png" alt="Account archive">
						<strong>Deletion requests</strong>
						<span>Handle account deletion requests</span>
					</a>
					<a class="ff-role-card" href="/admin/penalties" role="button">
						<img src="images/tile-penalties.png" alt="Penalty notice">
						<strong>Penalties</strong>
						<span>Approve or decline no-show penalty reports</span>
					</a>
					<a class="ff-role-card" href="/admin/directory" role="button">
						<img src="images/tile-directory.png" alt="Directory">
						<strong>Directory</strong>
						<span>Browse and manage users and offers</span>
					</a>
					<a class="ff-role-card" href="/admin-register" role="button">
						<img src="images/tile-register-admin.png" alt="New administrator">
						<strong>Register admin</strong>
						<span>Create another administrator account</span>
					</a>
					<a class="ff-role-card" href="/admin-loyalty" role="button">
						<img src="images/tile-loyalty.png" alt="Loyalty cards">
						<strong>Loyalty</strong>
						<span>Configure loyalty categories and rates</span>
					</a>
					<a class="ff-role-card" href="/admin-income" role="button">
						<img src="images/tile-income.png" alt="Income ledger">
						<strong>Income</strong>
						<span>System cut and income overview</span>
					</a>
				</div>
			</section>
		</div>
	`,
	mounted(){
		axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
	}
});
