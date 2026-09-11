const homePage = { template: '<homepage></homepage>' }
const signIn = { template: '<sign-in></sign-in>'}
const register = { template: '<register></register>'}
const profile = {template: '<profile></profile>'}
const boats = { template: '<boats></boats>'}
const bungalows = { template: '<bungalows></bungalows>'}
const courses = { template: '<courses></courses>'}
const bungalowReservationHistory = {template: '<bungalow-reservation-history></bungalow-reservation-history>'}
const boatReservationHistory = {template: '<boat-reservation-history></boat-reservation-history>'}
const courseReservationHistory = {template: '<course-reservation-history></course-reservation-history>'}
const following = {template: '<following></following>'}
const penalties = {template: '<penalties></penalties>'}
const makeReservation = {template: '<make-reservation></make-reservation>'}
const upcomingReservations = {template: '<upcoming-reservations></upcoming-reservations>'}
const actions = {template: '<actions></actions>'}
const reservationForm = {template: '<reservation-form></reservation-form>'}
const complaints = {template: '<complaints></complaints>'}
const myBungalows = {template: '<owner-my-bungalows></owner-my-bungalows>'}
const myBoats = {template: '<owner-my-boats></owner-my-boats>'}
const myCourses = {template: '<instructor-my-courses></instructor-my-courses>'}
const newCourse = {template: '<new-course></new-course>'}
const adminHome = {template: '<admin-home></admin-home>'}
const adminRegister = {template: '<admin-register></admin-register>'}
const adminRegistrations = {template: '<admin-registrations></admin-registrations>'}
const adminComplaints = {template: '<admin-complaints></admin-complaints>'}
const adminReviews = {template: '<admin-reviews></admin-reviews>'}
const adminDeletionRequests = {template: '<admin-deletion-requests></admin-deletion-requests>'}
const adminPenalties = {template: '<admin-penalties></admin-penalties>'}
const adminDirectory = {template: '<admin-directory></admin-directory>'}
const adminLoyalty = {template: '<admin-loyalty></admin-loyalty>'}
const ownerCalendar = {template: '<owner-calendar></owner-calendar>'}
const ownerReports = {template: '<owner-reports></owner-reports>'}
const visitReport = {template: '<visit-report></visit-report>'}
const adminIncome = {template: '<admin-income></admin-income>'}

const router = new VueRouter({
	  mode: 'history',
	  base: '/',
	  routes: [
	    { path: '/', component: homePage},
		{ path: '/sign-in', component: signIn},
		{ path: '/signIn', redirect: '/sign-in'},
		{ path: '/signin', redirect: '/sign-in'},
		{ path: '/login', redirect: '/sign-in'},
		{ path: '/bungalows', component: bungalows},
		{ path: '/boats', component: boats},
		{ path: '/courses', component: courses},
		{ path: '/instructors', redirect: '/courses'},
		{ path: '/register', component: register},
		{ path: '/account', component: profile },
		{ path: '/profile', redirect: '/account'},
		{ path: '/my-bungalows', component: myBungalows},
		{ path: '/myBungalows', redirect: '/my-bungalows'},
		{ path: '/my-boats', component: myBoats},
		{ path: '/myBoats', redirect: '/my-boats'},
		{ path: '/my-courses', component: myCourses},
		{ path: '/myCourses', redirect: '/my-courses'},
		{ path: '/new-course', component: newCourse},
		{ path: '/newCourse', redirect: '/new-course'},
		{ path: '/owner-calendar', component: ownerCalendar},
		{ path: '/calendar', redirect: '/owner-calendar'},
		{ path: '/owner-reports', component: ownerReports},
		{ path: '/reports', redirect: '/owner-reports'},
		{ path: '/visit-report', component: visitReport},
		{ path: '/bungalow-reservation-history', component: bungalowReservationHistory},
		{ path: '/bungalowReservationHistory', redirect: '/bungalow-reservation-history'},
		{ path: '/boat-reservation-history', component: boatReservationHistory},
		{ path: '/boatReservationHistory', redirect: '/boat-reservation-history'},
		{ path: '/course-reservation-history', component: courseReservationHistory},
		{ path: '/courseReservationHistory', redirect: '/course-reservation-history'},
		{ path: '/following', component: following},
		{ path: '/penalties', component: penalties},
		{ path: '/penals', redirect: '/penalties'},
		{ path: '/make-reservation', component: makeReservation},
		{ path: '/makeReservation', redirect: '/make-reservation'},
		{ path: '/upcoming-reservations', component: upcomingReservations},
		{ path: '/upcomingReservations', redirect: '/upcoming-reservations'},
		{ path: '/upcoming', redirect: '/upcoming-reservations'},
		{ path: '/actions/:id', component: actions},
		{ path: '/reservation-form/:id', component: reservationForm},
		{ path: '/reservationForm/:id', redirect: to => '/reservation-form/' + to.params.id},
		{ path: '/complaints', component: complaints},
		{ path: '/admin', component: adminHome},
		{ path: '/admin-reg-req-complaints', redirect: '/admin'},
		{ path: '/admin/registrations', component: adminRegistrations},
		{ path: '/admin/complaints', component: adminComplaints},
		{ path: '/admin/reviews', component: adminReviews},
		{ path: '/admin/deletion-requests', component: adminDeletionRequests},
		{ path: '/admin-user-complaints', redirect: '/admin/deletion-requests'},
		{ path: '/admin-user-requests', redirect: '/admin/deletion-requests'},
		{ path: '/admin/requests', redirect: '/admin/deletion-requests'},
		{ path: '/admin/penalties', component: adminPenalties},
		{ path: '/admin/directory', component: adminDirectory},
		{ path: '/admin-register', component: adminRegister},
		{ path: '/admin-loyalty', component: adminLoyalty},
		{ path: '/admin/loyalty', redirect: '/admin-loyalty'},
		{ path: '/admin-income', component: adminIncome},
		{ path: '/admin/income', redirect: '/admin-income'},
		{ path: '*', redirect: '/' }
	  ]
});

var app = new Vue({
	router,
	el: '#app',
});
