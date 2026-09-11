Vue.component('instructor-my-courses', {
	data: function(){
		return{
			loggedUser: { userType: '' },
			myCourses: [],
			allAdditionalServices: [],
			courseTimeSlots: [],
			offerActions: [],
			showPage: 0,
			sortOption: "",
			searchParams: {
				courseName: "",
				courseLocation: ""
			},
			selectedCourse: {},
			selectedCourseLocation: {},
			dtoEditCourse: {
				offerName: "",
				country: "",
				city: "",
				street: "",
				streetNumber: "",
				description: "",
				unitPrice: 0,
				maxCustomerCapacity: 0,
				rulesOfConduct: "",
				cancellationPolicy: "",
				additionalServices: [],
				image: []
			},
			dataToSend_AvailbleTimeSlot: {
				startTime: "",
				endTime: ""
			},
			bookClient: {
				customerEmail: '',
				termId: '',
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				additionalServices: ''
			},
			quickAction: {
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				totalPrice: 0,
				discount: 0,
				additionalServices: ''
			},
			backgroundColor: {},
			cursorStyle: {},
			map: null
		}
	},
	template: `
<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell" v-if="loggedUser.userType == 'INSTRUCTOR'">
				<div class="ff-section-head">
					<h2>My courses</h2>
					<p>Search, sort, and manage the courses you teach.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-filters">
						<div class="ff-filters__row">
							<label class="ff-control">
								<span>Course name</span>
								<input v-model="searchParams.courseName" class="ff-field" type="text" placeholder="Search by name" />
							</label>
							<label class="ff-control">
								<span>Location</span>
								<input v-model="searchParams.courseLocation" class="ff-field" type="text" placeholder="City or country" />
							</label>
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
								<button type="button" class="ff-btn ff-btn--primary" @click="search">Search</button>
								<a href="/new-course" class="ff-btn ff-btn--ink" style="display:inline-flex; align-items:center; text-decoration:none;">Add course</a>
							</div>
						</div>
					</div>

					<div class="ff-product-grid">
						<article class="ff-product" v-for="course in myCourses" :key="course.id">
							<div class="ff-product__media">
								<img v-if="course.images && course.images.length" :src="coverPath(course)" :alt="course.offerName" />
								<img v-else src="images/no-pictures.jpg" alt="No photo" />
							</div>
							<div class="ff-product__body">
								<h3>{{ course.offerName }}</h3>
								<p class="ff-product__meta">{{ course.unitPrice }} $ | * {{ course.rating }} | Cap {{ course.maxCustomerCapacity }}</p>
								<p class="ff-product__meta">{{ course.location ? (course.location.city + ', ' + course.location.country) : '' }}</p>
								<p>{{ course.description }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showDetails(course)">Details</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showUpdateAvailableTerms(course)">Terms</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showEditCourse(course)">Edit</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showCreateAction(course)">Actions</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showBookForClient(course)">Book for client</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="deleteOffer(course)">Delete</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!myCourses.length" class="ff-empty">No courses found.</p>
				</div>

				<div v-show="showPage == 2">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">{{ selectedCourse.offerName }}</h3>
						<div class="ff-detail__grid">
							<div><span>Country</span><strong>{{ selectedCourseLocation.country }}</strong></div>
							<div><span>City</span><strong>{{ selectedCourseLocation.city }}</strong></div>
							<div><span>Street</span><strong>{{ selectedCourseLocation.street }} {{ selectedCourseLocation.streetNumber }}</strong></div>
							<div><span>Unit price</span><strong>{{ selectedCourse.unitPrice }}</strong></div>
							<div><span>Capacity</span><strong>{{ selectedCourse.maxCustomerCapacity }}</strong></div>
							<div class="ff-detail__wide"><span>Description</span><strong>{{ selectedCourse.description }}</strong></div>
							<div class="ff-detail__wide"><span>Services</span>
								<strong>
									<span v-for="(additionalServ, i) in (selectedCourse.additionalServices || [])" :key="i">{{ additionalServ.name }}<span v-if="i < (selectedCourse.additionalServices || []).length - 1">, </span></span>
								</strong>
							</div>
							<div class="ff-detail__wide"><span>Rules</span><strong>{{ selectedCourse.rulesOfConduct }}</strong></div>
							<div class="ff-detail__wide"><span>Cancellation</span><strong>{{ selectedCourse.cancellationPolicy }}</strong></div>
						</div>
						<div id="owner-course-map" class="ff-offer-map"></div>
						<div class="ff-gallery" style="margin-top:1rem;">
							<img v-for="(image, ind) in selectedCourse.images" :key="ind" :src="setImage(image)" alt="Course photo" />
						</div>
					</div>
				</div>

				<div v-show="showPage == 3">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Edit course: {{ selectedCourse.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="text" placeholder="Course title" class="ff-field" v-model="dtoEditCourse.offerName" />
							<input type="text" placeholder="Country" class="ff-field" v-model="dtoEditCourse.country" />
							<input type="text" placeholder="City" class="ff-field" v-model="dtoEditCourse.city" />
							<input type="text" placeholder="Street" class="ff-field" v-model="dtoEditCourse.street" />
							<input type="text" placeholder="Street number" class="ff-field" v-model="dtoEditCourse.streetNumber" />
							<input type="number" placeholder="Unit price" class="ff-field" v-model="dtoEditCourse.unitPrice" />
							<input type="number" placeholder="Max capacity" class="ff-field" v-model="dtoEditCourse.maxCustomerCapacity" />
							<textarea rows="3" placeholder="Description" class="ff-field ff-field--wide" v-model="dtoEditCourse.description"></textarea>
							<div class="ff-field--wide">
								<p class="ff-product__meta">Additional services</p>
								<label v-for="additionalServ in allAdditionalServices" :key="'edit-' + additionalServ.id" style="display:block; margin-bottom:0.25rem;">
									<input type="checkbox" :checked="isEditServiceSelected(additionalServ)" v-on:click="clickEditAdditionalServ(additionalServ)" /> {{ additionalServ.name }}
								</label>
							</div>
							<textarea rows="3" placeholder="Rules of conduct" class="ff-field ff-field--wide" v-model="dtoEditCourse.rulesOfConduct"></textarea>
							<textarea rows="3" placeholder="Cancellation policy" class="ff-field ff-field--wide" v-model="dtoEditCourse.cancellationPolicy"></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="submitEditCourse">Save changes</button>
						</div>
					</div>
				</div>

				<div v-show="showPage == 5">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Update available terms: {{ selectedCourse.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="text" id="picker" name="daterange" class="ff-field ff-field--wide" />
							<div class="ff-detail__wide"><span>Start date</span><strong id="startDate"> ...... </strong></div>
							<div class="ff-detail__wide"><span>End date</span><strong id="endDate"> ...... </strong></div>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" :style="{'background-color':backgroundColor, 'cursor':cursorStyle}" @click="addNewTimeSlotToCourse(selectedCourse)">Add new available time slot</button>
						</div>
						<h3 class="ff-detail__title" style="margin-top:1.5rem;">Available terms</h3>
						<div class="ff-term" v-for="timeSlot in courseTimeSlots" :key="timeSlot.id || (timeSlot.startTime + timeSlot.endTime)">
							<p>Start: {{ timeSlot.startTime }}</p>
							<p>End: {{ timeSlot.endTime }}</p>
						</div>
						<p v-if="!courseTimeSlots.length" class="ff-empty">No terms listed.</p>
					</div>
				</div>

				<div v-show="showPage == 6">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Close</button>
						</div>
						<h3 class="ff-detail__title">Book for client: {{ selectedCourse.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="email" class="ff-field ff-field--wide" placeholder="Client email" v-model="bookClient.customerEmail" />
							<select class="ff-field ff-field--wide" v-model="bookClient.termId">
								<option disabled value="">Select available term</option>
								<option v-for="t in courseTimeSlots" :key="t.id" :value="t.id">{{ t.startTime }} → {{ t.endTime }}</option>
							</select>
							<input type="datetime-local" class="ff-field" v-model="bookClient.startDate" />
							<input type="number" min="1" class="ff-field" placeholder="Duration (days)" v-model="bookClient.duration" />
							<input type="number" min="1" class="ff-field" placeholder="Number of people" v-model="bookClient.numberOfPeople" />
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="submitBookForClient">Confirm booking</button>
						</div>
					</div>
				</div>

				<div v-show="showPage == 7">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Close</button>
						</div>
						<h3 class="ff-detail__title">Quick actions: {{ selectedCourse.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="datetime-local" class="ff-field" placeholder="Start date" v-model="quickAction.startDate" />
							<input type="number" min="1" class="ff-field" placeholder="Duration (days)" v-model="quickAction.duration" />
							<input type="number" min="1" class="ff-field" placeholder="Number of people" v-model="quickAction.numberOfPeople" />
							<input type="number" min="0" step="0.01" class="ff-field" placeholder="Total price" v-model="quickAction.totalPrice" />
							<input type="number" min="0" step="0.01" class="ff-field" placeholder="Discount" v-model="quickAction.discount" />
							<input type="text" class="ff-field ff-field--wide" placeholder="Additional services" v-model="quickAction.additionalServices" />
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="submitQuickAction">Create quick action</button>
						</div>
						<h3 class="ff-detail__title" style="margin-top:1.5rem;">Open actions</h3>
						<div class="ff-term" v-for="action in offerActions" :key="action.id">
							<p>{{ action.startDate }} → {{ action.endDate }}</p>
							<p>People: {{ action.numberOfPeople }} | Total: {{ action.totalPrice }} | Discount: {{ action.discount }}</p>
							<p v-if="action.additionalServices">Services: {{ action.additionalServices }}</p>
						</div>
						<p v-if="!offerActions.length" class="ff-empty">No open actions.</p>
					</div>
				</div>
			</section>
		</div>
	`,
	mounted(){
		this.loadData();
	},
	methods: {
		loadData(){
			var stored = window.localStorage.getItem('loggedUser');
			if (stored) {
				try {
					this.loggedUser = JSON.parse(stored) || { userType: '' };
				} catch (e) {
					this.loggedUser = { userType: '' };
				}
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get("/api/authenticateUser")
				.then(response => { this.loggedUser = response.data || this.loggedUser; })
				.catch(() => {});
			this.loadCourses();
			this.loadAllAdditionalServices();
		},
		loadCourses(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/allMyCourses').then(response => {
				this.myCourses = response.data || [];
			});
		},
		loadAllAdditionalServices(){
			axios.get('/api/getAllAdditionalServicesForBoatsAndCourses').then(response => {
				this.allAdditionalServices = response.data || [];
			});
		},
		coverPath(entity){
			var images = entity && entity.images ? entity.images : [];
			var cover = null;
			for (var i = 0; i < images.length; i++) {
				if (images[i] && images[i].name === 'first') {
					cover = images[i];
					break;
				}
			}
			if (!cover && images.length) cover = images[0];
			return this.setImage(cover);
		},
		setImage(image){
			if (!image) {
				return 'images/no-pictures.jpg';
			}
			if (image.path && image.path.indexOf('images/') === 0) {
				return image.path;
			}
			return 'http://localhost:8080/api/getImage/' + image.name;
		},
		backButton: function(){
			this.showPage = 0;
		},
		formatLocalDateTime: function(val){
			if (!val) return '';
			return val.length === 16 ? val + ':00' : val;
		},
		initDateRangePicker(){
			var today = new Date();
			$('input[name="daterange"]').daterangepicker({
				autoUpdateInput: true,
				timePicker24Hour: true,
				timePicker: true,
				autoApply: true,
				minDate: today,
				startDate: moment().startOf('hour'),
				endDate: moment().startOf('hour').add(32, 'hour'),
				locale: {
				  format: 'YYYY/MM/DD HH:mm',
				  firstDay: 1
				}},
				function(startDate, endDate, label){
					$('#startDate').text(startDate.format('YYYY-MM-DD'))
					$('#endDate').text(endDate.format('YYYY-MM-DD'))
				});
		},
		loadCourseTimeSlots(course){
			axios.get('/api/getTermsByOfferId/' + course.id)
			.then(response => {
				this.courseTimeSlots = response.data || [];
				this.courseTimeSlots.forEach((element, index) => {
					this.courseTimeSlots[index].startTime = String(element.startTime || '').replace("T", " ");
					this.courseTimeSlots[index].endTime = String(element.endTime || '').replace("T", " ");
				});
			});
		},
		showDetails: function(course){
			this.selectedCourse = course;
			this.selectedCourseLocation = course.location || {};
			this.showPage = 2;
			var self = this;
			this.$nextTick(function(){
				self.initMap('owner-course-map', course.location);
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
		showUpdateAvailableTerms: function(course){
			this.selectedCourse = course;
			this.selectedCourseLocation = course.location || {};
			this.loadCourseTimeSlots(this.selectedCourse);
			this.showPage = 5;
			this.$nextTick(() => this.initDateRangePicker());
		},
		addNewTimeSlotToCourse(){
			let startDate = moment($('input[name="daterange"]').data('daterangepicker').startDate).toDate();
			let endDate = moment($('input[name="daterange"]').data('daterangepicker').endDate).toDate();
			this.dataToSend_AvailbleTimeSlot.startTime = startDate;
			this.dataToSend_AvailbleTimeSlot.endTime = endDate;
			var isValidNewTimeSlot = !this.multipleDateRangeOverlaps();
			if(!isValidNewTimeSlot){
				Swal.fire('Invalid new time slot!', 'Timeslots cannot intersect!','error')
			}
			else{
				axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
				axios.post('/api/addNewTermToOffer/' + this.selectedCourse.id , this.dataToSend_AvailbleTimeSlot)
				.then(response => {
					if(response.data === true){
						Swal.fire('Added available time slot successfully!', 'Hurray!!', 'success')
						this.showUpdateAvailableTerms(this.selectedCourse)
					}
					else{ Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error') }
				}).catch( () => Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error') )
			}
		},
		multipleDateRangeOverlaps(){
			let timeIntervals = this.courseTimeSlots
			let newStartTime = this.dataToSend_AvailbleTimeSlot.startTime;
			let newEndTime = this.dataToSend_AvailbleTimeSlot.endTime;
			if(timeIntervals.length>0){
				for(let i = 0; i < timeIntervals.length; i++){
					if (this.dateRangeOverlaps(
							Date.parse(timeIntervals[i].startTime), Date.parse(timeIntervals[i].endTime),
							Date.parse(newStartTime), Date.parse(newEndTime)
							)
						) return true;
				}
			}
			return false;
		},
		dateRangeOverlaps(a_start, a_end, b_start, b_end) {
			if((a_end < b_start) || (b_end < a_start)) return false;
			return true;
		},
		showEditCourse: function(course){
			this.selectedCourse = course;
			var loc = course.location || {};
			var services = course.additionalServices || [];
			this.dtoEditCourse = {
				offerName: course.offerName || "",
				country: loc.country || "",
				city: loc.city || "",
				street: loc.street || "",
				streetNumber: loc.streetNumber || "",
				description: course.description || "",
				unitPrice: course.unitPrice || 0,
				maxCustomerCapacity: course.maxCustomerCapacity || 0,
				rulesOfConduct: course.rulesOfConduct || "",
				cancellationPolicy: course.cancellationPolicy || "",
				additionalServices: Array.isArray(services) ? services.slice() : Object.values(services || {}),
				image: []
			};
			this.showPage = 3;
		},
		isEditServiceSelected: function(additionalServ){
			return (this.dtoEditCourse.additionalServices || []).some(function(s){ return s.id == additionalServ.id; });
		},
		clickEditAdditionalServ: function(additionalServ){
			for (var i = 0; i < this.dtoEditCourse.additionalServices.length; i++) {
				if (this.dtoEditCourse.additionalServices[i].id == additionalServ.id) {
					this.dtoEditCourse.additionalServices.splice(i, 1);
					return;
				}
			}
			this.dtoEditCourse.additionalServices.push(additionalServ);
		},
		submitEditCourse: function(){
			if (!this.dtoEditCourse.offerName || !this.dtoEditCourse.country || !this.dtoEditCourse.city) {
				Swal.fire('Please fill the form properly!', 'Required fields are missing.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerName: this.dtoEditCourse.offerName,
				country: this.dtoEditCourse.country,
				city: this.dtoEditCourse.city,
				street: this.dtoEditCourse.street,
				streetNumber: this.dtoEditCourse.streetNumber,
				description: this.dtoEditCourse.description,
				unitPrice: Number(this.dtoEditCourse.unitPrice),
				maxCustomerCapacity: Number(this.dtoEditCourse.maxCustomerCapacity),
				rulesOfConduct: this.dtoEditCourse.rulesOfConduct,
				cancellationPolicy: this.dtoEditCourse.cancellationPolicy,
				additionalServices: this.dtoEditCourse.additionalServices,
				image: this.dtoEditCourse.image || []
			};
			axios.put('/api/updateCourse/' + this.selectedCourse.id, payload)
				.then(response => {
					if (response.data === true) {
						Swal.fire('Course updated!', 'Changes saved.', 'success');
						this.showPage = 0;
						this.loadCourses();
					} else {
						Swal.fire('Could not update', 'Offer may have active reservations.', 'error');
					}
				})
				.catch(() => Swal.fire('Could not update', 'Please try again later.', 'error'));
		},
		loadOfferActions: function(offerId){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.post('/api/getActionsForOffer', { id: String(offerId) })
				.then(response => {
					this.offerActions = response.data || [];
				});
		},
		showCreateAction: function(course){
			this.selectedCourse = course;
			this.quickAction = {
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				totalPrice: course.unitPrice || 0,
				discount: 0,
				additionalServices: ''
			};
			this.loadOfferActions(course.id);
			this.showPage = 7;
		},
		submitQuickAction: function(){
			if (!this.quickAction.startDate) {
				Swal.fire('Missing fields', 'Start date is required.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerId: String(this.selectedCourse.id),
				startDate: this.formatLocalDateTime(this.quickAction.startDate),
				duration: String(this.quickAction.duration),
				numberOfPeople: String(this.quickAction.numberOfPeople),
				totalPrice: String(this.quickAction.totalPrice),
				discount: String(this.quickAction.discount),
				additionalServices: this.quickAction.additionalServices || ''
			};
			axios.post('/api/createQuickAction', payload)
				.then(response => {
					if (response.data === true) {
						Swal.fire('Action created', 'Subscribers will be notified.', 'success');
						this.loadOfferActions(this.selectedCourse.id);
					} else {
						Swal.fire('Could not create action', 'Check overlaps or ownership.', 'error');
					}
				})
				.catch(() => Swal.fire('Could not create action', 'Please try again later.', 'error'));
		},
		showBookForClient: function(course){
			this.selectedCourse = course;
			this.bookClient = { customerEmail: '', termId: '', startDate: '', duration: 1, numberOfPeople: 1, additionalServices: '' };
			this.loadCourseTimeSlots(course);
			this.showPage = 6;
		},
		submitBookForClient: function(){
			if(!this.bookClient.customerEmail || !this.bookClient.termId || !this.bookClient.startDate){
				Swal.fire('Missing fields', 'Email, term and start date are required.', 'error');
				return;
			}
			var payload = {
				customerEmail: this.bookClient.customerEmail,
				termId: String(this.bookClient.termId),
				offerId: String(this.selectedCourse.id),
				startDate: this.formatLocalDateTime(this.bookClient.startDate),
				duration: String(this.bookClient.duration),
				numberOfPeople: String(this.bookClient.numberOfPeople),
				additionalServices: this.bookClient.additionalServices || ''
			};
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.post('/api/makeReservationForClient', payload)
				.then(response => {
					if(response.data === true){
						Swal.fire('Reservation created', 'Client was booked successfully.', 'success');
						this.showPage = 0;
					} else {
						Swal.fire('Could not book', 'Check free slots, penalties, or client email.', 'error');
					}
				})
				.catch(() => Swal.fire('Could not book', 'Please try again later.', 'error'));
		},
		deleteOffer: function(course){
			Swal.fire({
				title: 'Delete this course?',
				text: 'Blocked if there are active reservations.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Delete'
			}).then((result) => {
				if(!result.isConfirmed) return;
				axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
				axios.post('/api/deleteMyOffer', { id: String(course.id) })
					.then(response => {
						if(response.data === true){
							Swal.fire('Deleted', 'Offer removed.', 'success');
							this.loadCourses();
						} else {
							Swal.fire('Cannot delete', 'Offer may have active reservations.', 'error');
						}
					})
					.catch(() => Swal.fire('Cannot delete', 'Please try again later.', 'error'));
			});
		},
		search: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/allMyCourses').then(response => {
				var all = response.data || [];
				var name = (this.searchParams.courseName || "").toLowerCase();
				var loc = (this.searchParams.courseLocation || "").toLowerCase();
				this.myCourses = all.filter(function(course){
					var matchName = !name || (course.offerName && course.offerName.toLowerCase().indexOf(name) !== -1);
					var city = course.location && course.location.city ? course.location.city.toLowerCase() : "";
					var country = course.location && course.location.country ? course.location.country.toLowerCase() : "";
					var matchLoc = !loc || city.indexOf(loc) !== -1 || country.indexOf(loc) !== -1;
					return matchName && matchLoc;
				});
				if (this.sortOption) {
					this.sortedArray();
				}
			});
		},
		sortedArray: function(){
			if (this.sortOption === 'DescAlpha') {
				this.myCourses.sort(function(a, b){
					if (a.offerName > b.offerName) return -1;
					if (a.offerName < b.offerName) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'AscAlpha') {
				this.myCourses.sort(function(a, b){
					if (a.offerName < b.offerName) return -1;
					if (a.offerName > b.offerName) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'AscRating') {
				this.myCourses.sort(function(a, b){
					if (a.rating > b.rating) return -1;
					if (a.rating < b.rating) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'DescRating') {
				this.myCourses.sort(function(a, b){
					if (a.rating < b.rating) return -1;
					if (a.rating > b.rating) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'AscPrice') {
				this.myCourses.sort(function(a, b){
					if (a.unitPrice > b.unitPrice) return -1;
					if (a.unitPrice < b.unitPrice) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'DescPrice') {
				this.myCourses.sort(function(a, b){
					if (a.unitPrice < b.unitPrice) return -1;
					if (a.unitPrice > b.unitPrice) return 1;
					return 0;
				});
			}
		}
	}
});
