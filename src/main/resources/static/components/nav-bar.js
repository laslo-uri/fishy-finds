Vue.component('nav-bar', {
	data: function(){
		return{
			loggedUser: {
                userType:''
            },
			menuOpen: false,
			openGroup: ''
		};
	},
template: `	
		<div>
			<header class="ff-header">
				<div class="ff-header__inner">
					<a class="ff-brand" href="/" @click="closeMenu">
						<img src="images/fishy-finds-logo.png" alt="FishyFinds">
						<h1>FishyFinds</h1>
					</a>
					<button
						type="button"
						class="ff-nav-toggle"
						:aria-expanded="menuOpen ? 'true' : 'false'"
						aria-label="Toggle navigation"
						@click="menuOpen = !menuOpen">
						<span></span><span></span><span></span>
					</button>
					<nav class="ff-nav" :class="{ 'is-open': menuOpen }" @click="onNavClick">
						<template v-if="!loggedUser.userType">
							<a href="/bungalows">Bungalows</a>
							<a href="/boats">Boats</a>
							<a href="/courses">Courses</a>
							<a href="/register">Register</a>
							<a class="ff-cta" href="/sign-in">Sign in</a>
						</template>

						<template v-else-if="loggedUser.userType == 'CUSTOMER'">
							<div class="ff-nav-group" :class="{ 'is-open': openGroup === 'catalog' }">
								<button type="button" class="ff-nav-group__btn" @click.stop="toggleGroup('catalog')">Catalog</button>
								<div class="ff-nav-group__menu">
									<a href="/bungalows">Bungalows</a>
									<a href="/boats">Boats</a>
									<a href="/courses">Courses</a>
								</div>
							</div>
							<div class="ff-nav-group" :class="{ 'is-open': openGroup === 'bookings' }">
								<button type="button" class="ff-nav-group__btn" @click.stop="toggleGroup('bookings')">Bookings</button>
								<div class="ff-nav-group__menu">
									<a href="/make-reservation">Make reservation</a>
									<a href="/upcoming-reservations">Upcoming</a>
									<a href="/bungalow-reservation-history">History | bungalows</a>
									<a href="/boat-reservation-history">History | boats</a>
									<a href="/course-reservation-history">History | courses</a>
								</div>
							</div>
							<div class="ff-nav-group" :class="{ 'is-open': openGroup === 'account' }">
								<button type="button" class="ff-nav-group__btn" @click.stop="toggleGroup('account')">Account</button>
								<div class="ff-nav-group__menu">
									<a href="/account">My Account</a>
									<a href="/following">Following</a>
									<a href="/complaints">Complaints</a>
									<a href="/penalties">Penalties</a>
								</div>
							</div>
							<a href="/" @click="signOut">Sign out</a>
						</template>

						<template v-else-if="loggedUser.userType == 'BUNGALOW_OWNER'">
							<a href="/my-bungalows">My Bungalows</a>
							<a href="/owner-calendar">Calendar</a>
							<a href="/owner-reports">Reports</a>
							<a href="/visit-report">Visit report</a>
							<a href="/account">My Account</a>
							<a href="/" @click="signOut">Sign out</a>
						</template>

						<template v-else-if="loggedUser.userType == 'BOAT_OWNER'">
							<a href="/my-boats">My Boats</a>
							<a href="/owner-calendar">Calendar</a>
							<a href="/owner-reports">Reports</a>
							<a href="/visit-report">Visit report</a>
							<a href="/account">My Account</a>
							<a href="/" @click="signOut">Sign out</a>
						</template>

						<template v-else-if="loggedUser.userType == 'INSTRUCTOR'">
							<a href="/my-courses">My Courses</a>
							<a href="/new-course">New course</a>
							<a href="/owner-calendar">Calendar</a>
							<a href="/owner-reports">Reports</a>
							<a href="/visit-report">Visit report</a>
							<a href="/account">My Account</a>
							<a href="/" @click="signOut">Sign out</a>
						</template>

						<template v-else-if="loggedUser.userType == 'ADMIN'">
							<div class="ff-nav-group" :class="{ 'is-open': openGroup === 'moderation' }">
								<button type="button" class="ff-nav-group__btn" @click.stop="toggleGroup('moderation')">Moderation</button>
								<div class="ff-nav-group__menu">
									<a href="/admin">Admin home</a>
									<a href="/admin/registrations">Registrations</a>
									<a href="/admin/complaints">Complaints</a>
									<a href="/admin/reviews">Reviews</a>
									<a href="/admin/deletion-requests">Deletions</a>
									<a href="/admin/penalties">Penalties</a>
								</div>
							</div>
							<div class="ff-nav-group" :class="{ 'is-open': openGroup === 'finance' }">
								<button type="button" class="ff-nav-group__btn" @click.stop="toggleGroup('finance')">Finance</button>
								<div class="ff-nav-group__menu">
									<a href="/admin/directory">Directory</a>
									<a href="/admin-loyalty">Loyalty</a>
									<a href="/admin-income">Income</a>
									<a href="/admin-register">Add admin</a>
								</div>
							</div>
							<a href="/account">My Account</a>
							<a href="/" @click="signOut">Sign out</a>
						</template>
					</nav>
				</div>
		    </header>
    </div>
`,
    methods: {
		closeMenu: function(){
			this.menuOpen = false;
			this.openGroup = '';
		},
		toggleGroup: function(name){
			this.openGroup = this.openGroup === name ? '' : name;
		},
		onNavClick: function(event){
			var tag = event.target && event.target.tagName;
			if (tag === 'A') {
				this.closeMenu();
			}
		},
        signOut: function(event){
            if (event) event.preventDefault();
			this.closeMenu();
            window.localStorage.setItem("user", "");
            router.push('/sign-in');
        }
    },
    mounted(){
     axios.defaults.headers.common["Authorization"] =
                             localStorage.getItem("user");
        axios.get("/api/authenticateUser")
            .then(response => this.loggedUser = response.data || { userType: "" })
            .catch(() => this.loggedUser = { userType: "" })
    }
});
