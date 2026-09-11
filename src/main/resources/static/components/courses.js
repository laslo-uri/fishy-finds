Vue.component('courses', {
	data: function(){
		return{
			loggedUser: { userType: '' },
			courses: [],
			courseToShow: { offer: null, followed: false, path: '' },
			searchParams: {
				courseName: '',
				courseLocation: '',
				instructorsName: '',
				startDate: '',
				endDate: ''
			},
			showPage: 0,
			sortOption: '',
			terms: [],
			reviews: [],
			additionalServices: '',
			map: null
		};
	},
	template: `
	<div class="ff-catalog">
		<nav-bar></nav-bar>
		<section class="ff-catalog__shell">
			<div class="ff-section-head">
				<h2>Courses</h2>
				<p>Instructor-led fishing adventures - browse and book.</p>
			</div>

			<div v-show="showPage === 0">
				<div class="ff-filters">
					<div class="ff-filters__row">
						<label class="ff-control">
							<span>Course name</span>
							<input v-model="searchParams.courseName" class="ff-field" type="text" placeholder="e.g. Fly fishing intro" />
						</label>
						<label class="ff-control">
							<span>Location</span>
							<input v-model="searchParams.courseLocation" class="ff-field" type="text" placeholder="City or country" />
						</label>
						<label class="ff-control">
							<span>Instructor</span>
							<input v-model="searchParams.instructorsName" class="ff-field" type="text" placeholder="Instructor name" />
						</label>
						<label class="ff-control">
							<span>Available from</span>
							<input v-model="searchParams.startDate" class="ff-field" type="datetime-local" />
						</label>
						<label class="ff-control">
							<span>Available until</span>
							<input v-model="searchParams.endDate" class="ff-field" type="datetime-local" />
						</label>
					</div>
					<div class="ff-filters__row ff-filters__row--tight">
						<label class="ff-control">
							<span>Sort results</span>
							<select v-model="sortOption" class="ff-field" @change="sortedArray">
								<option disabled value="">Choose order</option>
								<option value="AscAlpha">Name A-Z</option>
								<option value="DescAlpha">Name Z-A</option>
								<option value="AscRating">Rating up</option>
								<option value="DescRating">Rating down</option>
								<option value="AscPrice">Price up</option>
								<option value="DescPrice">Price down</option>
							</select>
						</label>
						<div class="ff-filters__actions">
							<button class="ff-btn ff-btn--primary" type="button" @click="search">Search</button>
							<button class="ff-btn ff-btn--ghost" type="button" @click="clearFilters">Clear</button>
						</div>
					</div>
					<p class="ff-filters__hint">Leave dates empty to browse all courses. Sort updates the list immediately.</p>
				</div>

				<div class="ff-product-grid">
					<article class="ff-product" v-for="course in courses" :key="course.offer.id">
						<div class="ff-product__media">
							<img :src="course.path || 'images/no-pictures.png'" :alt="course.offer.offerName" />
						</div>
						<div class="ff-product__body">
							<h3>{{ course.offer.offerName }}</h3>
							<p class="ff-product__meta">
								{{ course.offer.user ? (course.offer.user.firstName + ' ' + course.offer.user.lastName) : 'Instructor' }}
								| {{ course.offer.unitPrice }} | * {{ course.offer.rating }}
							</p>
							<p>{{ course.offer.description }}</p>
							<div class="ff-product__actions">
								<button class="ff-btn ff-btn--primary" type="button" @click="showMore(course)">Details</button>
								<button
									v-if="loggedUser.userType === 'CUSTOMER' && !course.followed"
									class="ff-btn ff-btn--ink"
									type="button"
									@click="follow(course.offer)">Follow</button>
							</div>
						</div>
					</article>
				</div>
				<p v-if="!courses.length" class="ff-empty">No courses found.</p>
			</div>

			<div v-show="showPage === 1 && courseToShow.offer">
				<div class="ff-detail">
					<div class="ff-detail__toolbar">
						<button class="ff-btn ff-btn--ink" type="button" @click="showPage = 0">Back</button>
						<button class="ff-btn ff-btn--primary" type="button" @click="showTerms(courseToShow.offer)">Terms</button>
						<button class="ff-btn ff-btn--ink" type="button" @click="showPage = 3">Gallery</button>
						<button class="ff-btn ff-btn--ink" type="button" @click="showReviews(courseToShow.offer.id)">Reviews</button>
						<button class="ff-btn ff-btn--ink" type="button" @click="showActions(courseToShow.offer.id)">Actions</button>
					</div>
					<h3 class="ff-detail__title">{{ courseToShow.offer.offerName }}</h3>
					<div class="ff-detail__grid">
						<div><span>Instructor</span><strong>{{ courseToShow.offer.user && (courseToShow.offer.user.firstName + ' ' + courseToShow.offer.user.lastName) }}</strong></div>
						<div><span>Country</span><strong>{{ courseToShow.offer.location && courseToShow.offer.location.country }}</strong></div>
						<div><span>City</span><strong>{{ courseToShow.offer.location && courseToShow.offer.location.city }}</strong></div>
						<div><span>Price</span><strong>{{ courseToShow.offer.unitPrice }}</strong></div>
						<div><span>Capacity</span><strong>{{ courseToShow.offer.maxCustomerCapacity }}</strong></div>
						<div class="ff-detail__wide"><span>Description</span><strong>{{ courseToShow.offer.description }}</strong></div>
						<div class="ff-detail__wide"><span>Services</span><strong>{{ additionalServices }}</strong></div>
						<div class="ff-detail__wide"><span>Rules</span><strong>{{ courseToShow.offer.rulesOfConduct }}</strong></div>
						<div class="ff-detail__wide"><span>Cancellation</span><strong>{{ courseToShow.offer.cancellationPolicy }}</strong></div>
					</div>
					<div id="course-detail-map" class="ff-offer-map"></div>
				</div>
			</div>

			<div v-show="showPage === 2">
				<div class="ff-detail">
					<button class="ff-btn ff-btn--ink" type="button" @click="showPage = 1">Back</button>
					<h3 class="ff-detail__title">Available terms</h3>
					<div class="ff-term" v-for="term in terms" :key="term.id">
						<p>Start: {{ term.startTime || term.startDate }}</p>
						<p>End: {{ term.endTime || term.endDate }}</p>
						<button
							v-if="loggedUser.userType === 'CUSTOMER'"
							class="ff-btn ff-btn--primary"
							type="button"
							@click="showReservation(term)">Make reservation</button>
					</div>
					<p v-if="!terms.length" class="ff-empty">No terms listed.</p>
				</div>
			</div>

			<div v-show="showPage === 3 && courseToShow.offer">
				<div class="ff-detail">
					<button class="ff-btn ff-btn--ink" type="button" @click="showPage = 1">Back</button>
					<h3 class="ff-detail__title">Gallery</h3>
					<div class="ff-gallery">
						<img v-for="i in courseToShow.offer.images" :key="i.id" :src="i.path" :alt="i.name" />
					</div>
				</div>
			</div>

			<div v-show="showPage === 4">
				<div class="ff-detail">
					<button class="ff-btn ff-btn--ink" type="button" @click="showPage = 1">Back</button>
					<h3 class="ff-detail__title">Reviews</h3>
					<div class="ff-review" v-for="r in reviews" :key="r.id">
						<p><strong>Owner:</strong> {{ r.contentForOwner }} (* {{ r.rateOwner }})</p>
						<p><strong>Offer:</strong> {{ r.contentForOffer }} (* {{ r.rateOffer }})</p>
					</div>
					<p v-if="!reviews.length" class="ff-empty">No reviews yet.</p>
				</div>
			</div>
		</section>
	</div>
	`,
	computed: {
		axiosParams() {
			const params = new URLSearchParams();
			params.append('name', this.searchParams.courseName);
			params.append('location', this.searchParams.courseLocation);
			params.append('type', 'COURSE');
			params.append('firstLastName', this.searchParams.instructorsName);
			params.append('startDate', this.searchParams.startDate);
			params.append('endDate', this.searchParams.endDate);
			return params;
		}
	},
	methods: {
		showReviews: function(id) {
			axios.post('/api/allAcceptedFeedbacksForOffer', { id: id })
				.then((result) => {
					this.reviews = result.data || [];
					this.showPage = 4;
				});
		},
		showActions: function(id) {
			router.push('/actions/' + id);
		},
		showReservation: function(term) {
			router.push('/reservationForm/' + term.id);
		},
		showTerms: function(course) {
			axios.defaults.headers.common['Authorization'] = localStorage.getItem('user');
			axios.get('/api/getTermsByOfferId/' + course.id)
				.then((result) => {
					this.terms = result.data || [];
					this.showPage = 2;
				});
		},
		showMore: function(course) {
			this.courseToShow = course;
			this.additionalServices = '';
			var services = (course.offer && course.offer.additionalServices) || [];
			for (var i = 0; i < services.length; i++) {
				this.additionalServices += (i ? ', ' : '') + services[i].name;
			}
			this.showPage = 1;
			var self = this;
			this.$nextTick(function(){
				self.initMap('course-detail-map', course.offer && course.offer.location);
			});
		},
		initMap: function(targetId, location){
			var el = document.getElementById(targetId);
			if (!el || typeof ol === 'undefined') return;
			el.innerHTML = '';
			var lon = 19.84;
			var lat = 45.25;
			if (location) {
				if (location.longitude) lon = Number(location.longitude);
				if (location.latitude) lat = Number(location.latitude);
				if (Math.abs(lon) > 40 && Math.abs(lat) < 40) {
					var swapped = lon;
					lon = lat;
					lat = swapped;
				}
			}
			if (!lon && !lat) {
				lon = 19.84;
				lat = 45.25;
			}
			var center = ol.proj.fromLonLat([lon, lat]);
			this.map = new ol.Map({
				target: targetId,
				layers: [
					new ol.layer.Tile({ source: new ol.source.OSM() })
				],
				view: new ol.View({
					center: center,
					zoom: 14
				})
			});
			var marker = new ol.Feature({ geometry: new ol.geom.Point(center) });
			this.map.addLayer(new ol.layer.Vector({
				source: new ol.source.Vector({ features: [marker] }),
				style: new ol.style.Style({
					image: new ol.style.Circle({
						radius: 8,
						fill: new ol.style.Fill({ color: '#ed1c24' }),
						stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
					})
				})
			}));
			setTimeout(function(){ if (this.map) this.map.updateSize(); }.bind(this), 50);
		},
		follow: function(course) {
			axios.defaults.headers.common['Authorization'] = localStorage.getItem('user');
			axios.post('/api/addFollower', { id: course.id }).then(() => {
				axios.get('/api/allCourses').then((response) => {
					this.courses = response.data || [];
				});
			});
		},
		search: function() {
			var start = this.searchParams.startDate;
			var end = this.searchParams.endDate;
			if ((start && !end) || (!start && end)) {
				Swal.fire('Please fill both date fields!', '', 'error');
				return;
			}
			if (start && end) {
				var today = new Date();
				var startDate = new Date(start);
				var endDate = new Date(end);
				if (startDate <= today || endDate <= today) {
					Swal.fire('Date cannot be in the past!', '', 'error');
					return;
				}
				if (!(startDate < endDate)) {
					Swal.fire('Start date must be before end date', '', 'error');
					return;
				}
			}
			axios.get('/api/search', { params: this.axiosParams }).then((response) => {
				this.courses = response.data || [];
			});
		},
		clearFilters: function() {
			this.searchParams.courseName = '';
			this.searchParams.courseLocation = '';
			this.searchParams.instructorsName = '';
			this.searchParams.startDate = '';
			this.searchParams.endDate = '';
			this.sortOption = '';
			axios.get('/api/allCourses').then((response) => {
				this.courses = response.data || [];
			});
		},
		sortedArray: function() {
			var option = this.sortOption;
			function by(getter, desc) {
				return function(a, b) {
					var av = getter(a);
					var bv = getter(b);
					if (av > bv) return desc ? -1 : 1;
					if (av < bv) return desc ? 1 : -1;
					return 0;
				};
			}
			if (option === 'DescAlpha') this.courses.sort(by(function(x){ return x.offer.offerName; }, true));
			if (option === 'AscAlpha') this.courses.sort(by(function(x){ return x.offer.offerName; }, false));
			if (option === 'DescRating') this.courses.sort(by(function(x){ return x.offer.rating; }, true));
			if (option === 'AscRating') this.courses.sort(by(function(x){ return x.offer.rating; }, false));
			if (option === 'DescPrice') this.courses.sort(by(function(x){ return x.offer.unitPrice; }, true));
			if (option === 'AscPrice') this.courses.sort(by(function(x){ return x.offer.unitPrice; }, false));
		}
	},
	mounted() {
		axios.defaults.headers.common['Authorization'] = localStorage.getItem('user');
		axios.get('/api/allCourses').then((response) => {
			this.courses = response.data || [];
			if (this.courses.length) this.courseToShow = this.courses[0];
			axios.get('/api/authenticateUser')
				.then((r) => { this.loggedUser = r.data || { userType: '' }; })
				.catch(() => { this.loggedUser = { userType: '' }; });
		});
	}
});
