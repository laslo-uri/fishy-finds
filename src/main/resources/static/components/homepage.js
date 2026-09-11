Vue.component('homepage', {

	data: function(){
		return{
			loggedUser: {
				userType:''
			},
			passwordDTO: {
               id: null,
               oldPassword: '',
               newPassword: ''
            },
			confirmPassword: '',
			map:{}
		}
	},
template: `

		<div class="homepage ff-home">
			<nav-bar></nav-bar>

			<section class="ff-hero" v-if="loggedUser.userType == '' || loggedUser.userType == 'CUSTOMER'">
				<div class="ff-hero__media" aria-hidden="true"></div>
				<div class="ff-hero__shade" aria-hidden="true"></div>
				<div class="ff-hero__content">
					<div class="ff-hero__eyebrow">Coastal stays &amp; fishing days</div>
					<p class="ff-hero__brand">FishyFinds</p>
					<p class="ff-hero__lead">Book bungalows, boats, and instructor-led courses with the clarity of a product catalog and the calm of a harbor morning.</p>
					<div class="ff-hero__actions">
						<a class="ff-btn ff-btn--primary" href="/bungalows">Browse bungalows</a>
						<a class="ff-btn ff-btn--ghost" href="/boats">Explore boats</a>
						<a class="ff-btn ff-btn--ghost" href="/courses">Find courses</a>
					</div>
				</div>
			</section>

			<section class="ff-discover" v-if="loggedUser.userType == '' || loggedUser.userType == 'CUSTOMER'">
				<div class="ff-section-head">
					<h2>Products</h2>
					<p>Three ways to plan your next trip - stays, vessels, and guided fishing.</p>
				</div>
				<div class="ff-discover__grid">
					<a class="ff-tile" href="/bungalows">
						<div class="ff-tile__media">
							<img src="images/homepage-bungalows.png" alt="Coastal bungalow overlooking turquoise water">
						</div>
						<div class="ff-tile__body">
							<h3>Bungalows</h3>
							<p>Rest by the water after a full day of fishing.</p>
							<span class="ff-tile__link">View stays</span>
						</div>
					</a>
					<a class="ff-tile" href="/boats">
						<div class="ff-tile__media">
							<img src="images/homepage-boats.png" alt="Fishing boat on calm dawn water">
						</div>
						<div class="ff-tile__body">
							<h3>Boats</h3>
							<p>Charters and day boats for the next stretch of coastline.</p>
							<span class="ff-tile__link">View boats</span>
						</div>
					</a>
					<a class="ff-tile" href="/courses">
						<div class="ff-tile__media">
							<img src="images/homepage-courses.png" alt="Shore casting lesson at sunrise">
						</div>
						<div class="ff-tile__body">
							<h3>Courses</h3>
							<p>Learn with instructors who know the local waters.</p>
							<span class="ff-tile__link">View courses</span>
						</div>
					</a>
				</div>
			</section>

			<div class="ff-owner-panel" v-if="loggedUser.userType == 'BUNGALOW_OWNER'">
				<h1 class="ff-panel-title">My bungalows</h1>
				<div class="wrapper">
					<div class="card">
						<img src="images/homepage-bungalows.png" alt="">
						<div class="info">
							<h1>Portfolio</h1>
							<p>Manage availability, photos, and guest stays.</p>
							<a class="ff-btn ff-btn--primary" href="/my-bungalows">Open portfolio</a>
						</div>
					</div>
				</div>
			</div>

			<div class="ff-owner-panel" v-if="loggedUser.userType == 'BOAT_OWNER'">
				<h1 class="ff-panel-title">My fleet</h1>
				<div class="wrapper">
					<div class="card">
						<img src="images/homepage-boats.png" alt="">
						<div class="info">
							<h1>Boats</h1>
							<p>Keep charters, calendars, and reports in one place.</p>
							<a class="ff-btn ff-btn--primary" href="/my-boats">Open fleet</a>
						</div>
					</div>
				</div>
			</div>

			<div class="ff-owner-panel" v-if="loggedUser.userType == 'INSTRUCTOR'">
				<h1 class="ff-panel-title">My courses</h1>
				<div class="wrapper">
					<div class="card">
						<img src="images/homepage-courses.png" alt="">
						<div class="info">
							<h1>Courses</h1>
							<p>Publish adventures and guide your next group.</p>
							<a class="ff-btn ff-btn--primary" href="/my-courses">Open courses</a>
						</div>
					</div>
				</div>
			</div>

			<div class="ff-admin-panel" v-if="loggedUser.userType == 'ADMIN'">
				<div class="ff-section-head" v-if="loggedUser.numberOfLogIns > 0" style="padding: 2rem 1rem 0;">
					<h2>Admin console</h2>
					<p>Moderation queues, loyalty, and platform income.</p>
				</div>

				<div class="ff-role-grid" v-if="loggedUser.numberOfLogIns > 0" style="padding: 1rem;">
					<a class="ff-role-card" href="/admin">
						<img src="images/tile-directory.png" alt="Admin dashboard">
						<strong>Admin home</strong>
						<span>Open all moderation and finance tools</span>
					</a>
					<a class="ff-role-card" href="/admin/registrations">
						<img src="images/tile-registrations.png" alt="Registrations">
						<strong>Registrations</strong>
						<span>Approve or reject advertiser sign-ups</span>
					</a>
					<a class="ff-role-card" href="/admin-loyalty">
						<img src="images/tile-loyalty.png" alt="Loyalty">
						<strong>Loyalty &amp; income</strong>
						<span>Categories and platform cut</span>
					</a>
					<a class="ff-role-card" href="/account">
						<img src="images/tile-register-admin.png" alt="Profile">
						<strong>Profile</strong>
						<span>Update account details and password</span>
					</a>
				</div>

                <div class="ff-catalog__shell" v-if="loggedUser.numberOfLogIns == 0">
                    <div class="ff-detail" style="max-width:420px; margin: 2rem auto;">
                        <h3 class="ff-detail__title">Please change your password</h3>
                        <p>Since this is your first login on FishyFinds, you must set a new password.</p>
                        <div class="ff-form-grid">
                            <input type="password" placeholder="Old password" class="ff-field ff-field--wide" v-model="passwordDTO.oldPassword"/>
                            <input type="password" placeholder="New password" class="ff-field ff-field--wide" v-model="passwordDTO.newPassword"/>
                            <input type="password" placeholder="Confirm new password" class="ff-field ff-field--wide" v-model="confirmPassword"/>
                        </div>
                        <div class="ff-detail__toolbar" style="margin-top:1rem;">
                            <button type="button" class="ff-btn ff-btn--primary" :disabled="!isCompletePassword" @click="savePassword">Update password</button>
                        </div>
                    </div>
                </div>
			</div>
		</div>
		`
	,

	computed : {
            isCompletePassword () {
                    flag = /\S/.test(this.passwordDTO.newPassword) && /\S/.test(this.confirmPassword);

                    return flag;
            }
        },

    methods : {

        savePassword : function(){
                    if(this.passwordDTO.newPassword == this.confirmPassword){
                        Swal.fire({
                                      title: 'Are you sure?',
                                      text: "You won't be able to revert this!",
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#ed1c24',
                                      cancelButtonColor: '#6c6c6c',
                                      confirmButtonText: 'Yes, change my password!'
                                    }).then((result) => {
                                        if(result.isConfirmed){
                                            axios.put('/api/changePassword', this.passwordDTO)
                                                 .then(response => {
                                                    if(response.data === true){
                                                        Swal.fire('Password changed successfuly!',
                                                                  '',
                                                                  'success')
                                                    }
                                                    else{
                                                        Swal.fire('Ooops, something went wrong!',
                                                                  'Please, try again later!',
                                                                  'error')
                                                    }

                                                 })
                                            }
                                    })
                    }
                    else{

                        Swal.fire('Ooops, looks like your passwords don\'t match!',
                                   'Please, try again later!',
                                   'error')


                    }
                }
	},
	mounted(){
		axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
		axios.get("/api/authenticateUser")
			.then(response => {
				this.loggedUser = response.data || { userType: '' };
				if (this.loggedUser && this.loggedUser.id) {
					this.passwordDTO.id = this.loggedUser.id;
				}
			})
			.catch(() => { this.loggedUser = { userType: '' }; });
	}
});
