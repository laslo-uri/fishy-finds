Vue.component('owner-my-boats', {
	data: function(){
		return{
			loggedUser: { userType: '' },
			myBoats: [],
			allAdditionalServices: [],
			showPage: 0,
			sortOption: "",
			searchParams: {
				boatName: "",
				boatLocation: ""
			},
			selectedBoat: {},
			selectedBoatLocation: {},
			dtoAddNewBoat: {
				offerName: "",
				country: "",
				city: "",
				street: "",
				streetNumber: "",
				longitude: 19.84,
				latitude: 45.25,
				description: "",
				unitPrice: 0,
				maxCustomerCapacity: 0,
				rulesOfConduct: "",
				cancellationPolicy: "",
				boatType: "",
				boatLength: 0,
				numberOfEngines: 0,
				power: 0,
				maxSpeed: 0,
				additionalServices: [],
				image: [],
				imageCount: 0,
				imagesFrontend: []
			},
			dtoEditBoat: {
				offerName: "",
				country: "",
				city: "",
				street: "",
				streetNumber: "",
				longitude: 19.84,
				latitude: 45.25,
				description: "",
				unitPrice: 0,
				maxCustomerCapacity: 0,
				rulesOfConduct: "",
				cancellationPolicy: "",
				boatType: "",
				boatLength: 0,
				numberOfEngines: 0,
				power: 0,
				maxSpeed: 0,
				additionalServices: [],
				image: []
			},
			dataToSend_AvailbleTimeSlot: {
				startTime: "",
				endTime: ""
			},
			backgroundColor: {},
			cursorStyle: {},
			boatTimeSlots: [],
			offerActions: [],
			quickAction: {
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				totalPrice: 0,
				discount: 0,
				additionalServices: ''
			},
			bookClient: {
				customerEmail: '',
				termId: '',
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				additionalServices: ''
			},
			map: null
		}
	},
	template: `
<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell" v-if="loggedUser.userType == 'BOAT_OWNER'">
				<div class="ff-section-head">
					<h2>My boats</h2>
					<p>Search, sort, and manage your boat listings.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-filters">
						<div class="ff-filters__row">
							<label class="ff-control">
								<span>Boat name</span>
								<input v-model="searchParams.boatName" class="ff-field" type="text" placeholder="Search by name" />
							</label>
							<label class="ff-control">
								<span>Location</span>
								<input v-model="searchParams.boatLocation" class="ff-field" type="text" placeholder="City or country" />
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
								<button type="button" class="ff-btn ff-btn--ink" @click="showAddNewBoatForm">Add boat</button>
							</div>
						</div>
					</div>

					<div class="ff-product-grid">
						<article class="ff-product" v-for="boat in myBoats" :key="boat.id">
							<div class="ff-product__media">
								<img v-if="boat.images && boat.images.length" :src="setImage(boat.images[0])" :alt="boat.offerName" />
								<img v-else src="images/no-pictures.jpg" alt="No photo" />
							</div>
							<div class="ff-product__body">
								<h3>{{ boat.offerName }}</h3>
								<p class="ff-product__meta">{{ boat.unitPrice }} $ | * {{ boat.rating }} | {{ boat.location ? boat.location.city : '' }}</p>
								<p class="ff-product__meta">Type: {{ boat.boatType }} | Length: {{ boat.boatLength }} m<span v-if="boat.engine"> | Engines: {{ boat.engine.numberOfEngines }} | Power: {{ boat.engine.power }} | Max speed: {{ boat.engine.maxSpeed }}</span></p>
								<p>{{ boat.description }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showDetails(boat)">Details</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showUpdateAvailableTerms(boat)">Terms</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showEditBoat(boat)">Edit</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showCreateAction(boat)">Actions</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showBookForClient(boat)">Book for client</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="deleteOffer(boat)">Delete</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!myBoats.length" class="ff-empty">No boats found.</p>
				</div>

				<div v-show="showPage == 1">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Add a new boat</h3>
						<div class="ff-form-grid">
							<input type="text" placeholder="Boat name" class="ff-field" v-model="dtoAddNewBoat.offerName" />
							<input type="text" placeholder="Country" class="ff-field" v-model="dtoAddNewBoat.country" />
							<input type="text" placeholder="City" class="ff-field" v-model="dtoAddNewBoat.city" />
							<input type="text" placeholder="Street" class="ff-field" v-model="dtoAddNewBoat.street" />
							<input type="text" placeholder="Street number" class="ff-field" v-model="dtoAddNewBoat.streetNumber" />
							<input type="number" placeholder="Unit price" class="ff-field" v-model="dtoAddNewBoat.unitPrice" />
							<input type="number" placeholder="Max capacity" class="ff-field" v-model="dtoAddNewBoat.maxCustomerCapacity" />
							<input type="text" placeholder="Boat type" class="ff-field" v-model="dtoAddNewBoat.boatType" />
							<input type="number" placeholder="Length (m)" class="ff-field" v-model="dtoAddNewBoat.boatLength" />
							<input type="number" placeholder="Engines" class="ff-field" v-model="dtoAddNewBoat.numberOfEngines" />
							<input type="number" placeholder="Power" class="ff-field" v-model="dtoAddNewBoat.power" />
							<input type="number" placeholder="Max speed" class="ff-field" v-model="dtoAddNewBoat.maxSpeed" />
							<textarea rows="3" placeholder="Description" class="ff-field ff-field--wide" v-model="dtoAddNewBoat.description"></textarea>
							<div class="ff-field--wide">
								<p class="ff-product__meta">Additional services</p>
								<label v-for="additionalServ in allAdditionalServices" :key="additionalServ.id" style="display:block; margin-bottom:0.25rem;">
									<input type="checkbox" v-on:click="clickAdditionalServ(additionalServ)" /> {{ additionalServ.name }}
								</label>
							</div>
							<textarea rows="3" placeholder="Rules of conduct" class="ff-field ff-field--wide" v-model="dtoAddNewBoat.rulesOfConduct"></textarea>
							<textarea rows="3" placeholder="Cancellation policy" class="ff-field ff-field--wide" v-model="dtoAddNewBoat.cancellationPolicy"></textarea>
							<div class="ff-field--wide">
								<input type="file" name="file[]" @change="imageSelected" multiple="multiple" />
								<div class="ff-gallery" style="margin-top:0.75rem;">
									<div v-for="(image, ind) in dtoAddNewBoat.imagesFrontend" :key="ind">
										<img :src="image.path" alt="Preview" />
										<button type="button" class="ff-btn ff-btn--ink" @click="removeImage(image, ind)">Remove</button>
									</div>
								</div>
							</div>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" :style="{'background-color':backgroundColor, 'cursor':cursorStyle}" @click="addNewBoat()">Add new boat</button>
						</div>
					</div>
				</div>

				<div v-show="showPage == 2">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">{{ selectedBoat.offerName }}</h3>
						<div class="ff-detail__grid">
							<div><span>Country</span><strong>{{ selectedBoatLocation.country }}</strong></div>
							<div><span>City</span><strong>{{ selectedBoatLocation.city }}</strong></div>
							<div><span>Street</span><strong>{{ selectedBoatLocation.street }} {{ selectedBoatLocation.streetNumber }}</strong></div>
							<div><span>Boat type</span><strong>{{ selectedBoat.boatType }}</strong></div>
							<div><span>Length (m)</span><strong>{{ selectedBoat.boatLength }}</strong></div>
							<div v-if="selectedBoat.engine"><span>Engines</span><strong>{{ selectedBoat.engine.numberOfEngines }}</strong></div>
							<div v-if="selectedBoat.engine"><span>Power</span><strong>{{ selectedBoat.engine.power }}</strong></div>
							<div v-if="selectedBoat.engine"><span>Max speed</span><strong>{{ selectedBoat.engine.maxSpeed }}</strong></div>
							<div><span>Unit price</span><strong>{{ selectedBoat.unitPrice }}</strong></div>
							<div><span>Capacity</span><strong>{{ selectedBoat.maxCustomerCapacity }}</strong></div>
							<div class="ff-detail__wide"><span>Description</span><strong>{{ selectedBoat.description }}</strong></div>
							<div class="ff-detail__wide"><span>Rules</span><strong>{{ selectedBoat.rulesOfConduct }}</strong></div>
							<div class="ff-detail__wide"><span>Cancellation</span><strong>{{ selectedBoat.cancellationPolicy }}</strong></div>
						</div>
						<div id="owner-boat-map" class="ff-offer-map"></div>
						<div class="ff-gallery" style="margin-top:1rem;">
							<img v-for="(image, ind) in selectedBoat.images" :key="ind" :src="setImage(image)" alt="Boat photo" />
						</div>
					</div>
				</div>

				<div v-show="showPage == 3">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Edit boat: {{ selectedBoat.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="text" placeholder="Boat name" class="ff-field" v-model="dtoEditBoat.offerName" />
							<input type="text" placeholder="Country" class="ff-field" v-model="dtoEditBoat.country" />
							<input type="text" placeholder="City" class="ff-field" v-model="dtoEditBoat.city" />
							<input type="text" placeholder="Street" class="ff-field" v-model="dtoEditBoat.street" />
							<input type="text" placeholder="Street number" class="ff-field" v-model="dtoEditBoat.streetNumber" />
							<input type="number" placeholder="Unit price" class="ff-field" v-model="dtoEditBoat.unitPrice" />
							<input type="number" placeholder="Max capacity" class="ff-field" v-model="dtoEditBoat.maxCustomerCapacity" />
							<input type="text" placeholder="Boat type" class="ff-field" v-model="dtoEditBoat.boatType" />
							<input type="number" placeholder="Length (m)" class="ff-field" v-model="dtoEditBoat.boatLength" />
							<input type="number" placeholder="Engines" class="ff-field" v-model="dtoEditBoat.numberOfEngines" />
							<input type="number" placeholder="Power" class="ff-field" v-model="dtoEditBoat.power" />
							<input type="number" placeholder="Max speed" class="ff-field" v-model="dtoEditBoat.maxSpeed" />
							<textarea rows="3" placeholder="Description" class="ff-field ff-field--wide" v-model="dtoEditBoat.description"></textarea>
							<div class="ff-field--wide">
								<p class="ff-product__meta">Additional services</p>
								<label v-for="additionalServ in allAdditionalServices" :key="'edit-' + additionalServ.id" style="display:block; margin-bottom:0.25rem;">
									<input type="checkbox" :checked="isEditServiceSelected(additionalServ)" v-on:click="clickEditAdditionalServ(additionalServ)" /> {{ additionalServ.name }}
								</label>
							</div>
							<textarea rows="3" placeholder="Rules of conduct" class="ff-field ff-field--wide" v-model="dtoEditBoat.rulesOfConduct"></textarea>
							<textarea rows="3" placeholder="Cancellation policy" class="ff-field ff-field--wide" v-model="dtoEditBoat.cancellationPolicy"></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="submitEditBoat">Save changes</button>
						</div>
					</div>
				</div>

				<div v-show="showPage == 5">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Update available terms: {{ selectedBoat.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="text" id="picker" name="daterange" class="ff-field ff-field--wide" />
							<div class="ff-detail__wide"><span>Start date</span><strong id="startDate"> ...... </strong></div>
							<div class="ff-detail__wide"><span>End date</span><strong id="endDate"> ...... </strong></div>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" :style="{'background-color':backgroundColor, 'cursor':cursorStyle}" @click="addNewTimeSlotToBoat(selectedBoat)">Add new available time slot</button>
						</div>
						<h3 class="ff-detail__title" style="margin-top:1.5rem;">Available terms</h3>
						<div class="ff-term" v-for="timeSlot in boatTimeSlots" :key="timeSlot.id || (timeSlot.startTime + timeSlot.endTime)">
							<p>Start: {{ timeSlot.startTime }}</p>
							<p>End: {{ timeSlot.endTime }}</p>
						</div>
						<p v-if="!boatTimeSlots.length" class="ff-empty">No terms listed.</p>
					</div>
				</div>

				<div v-show="showPage == 6">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Close</button>
						</div>
						<h3 class="ff-detail__title">Book for client: {{ selectedBoat.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="email" class="ff-field ff-field--wide" placeholder="Client email" v-model="bookClient.customerEmail" />
							<select class="ff-field ff-field--wide" v-model="bookClient.termId">
								<option disabled value="">Select available term</option>
								<option v-for="t in boatTimeSlots" :key="t.id" :value="t.id">{{ t.startTime }} → {{ t.endTime }}</option>
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
						<h3 class="ff-detail__title">Quick actions: {{ selectedBoat.offerName }}</h3>
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
				this.loggedUser = JSON.parse(stored);
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get("/api/authenticateUser")
				.then(response => { this.loggedUser = response.data || this.loggedUser; })
				.catch(() => {});
			this.loadOwnersBoats();
			this.loadAllAdditionalServices();
		},
		loadOwnersBoats(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/allMyBoats').then(response => {
				this.myBoats = response.data || [];
			});
		},
		loadAllAdditionalServices(){
			axios.get('/api/getAllAdditionalServicesForBoatsAndCourses').then(response => {
				this.allAdditionalServices = response.data || [];
			});
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
		imageSelected(event){
			const file = document.querySelector('input[type=file]');
			var readers = new Array(file.files.length);
			for (var i = 0; i < file.files.length; ++i) {
				readers[i] = new FileReader();
				readers[i].name = i;
			}
			var i = 0;
			var self = this;
			while (i < file.files.length) {
				var cFile = file.files[i];
				if (cFile != null) {
					readers[i].onloadend = (function(idx, fileRef) {
						return function() {
							self.dtoAddNewBoat.image.push(readers[idx].result);
							self.dtoAddNewBoat.imageCount++;
							self.dtoAddNewBoat.imagesFrontend.push({
								id: self.dtoAddNewBoat.imageCount,
								name: "" + self.dtoAddNewBoat.imageCount,
								path: URL.createObjectURL(fileRef)
							});
						};
					})(i, cFile);
					readers[i].readAsDataURL(cFile);
					++i;
				} else {
					++i;
				}
			}
		},
		removeImage: function(image, index){
			this.dtoAddNewBoat.imageCount--;
			this.dtoAddNewBoat.imagesFrontend.splice(index, 1);
			this.dtoAddNewBoat.image.splice(index, 1);
		},
		resetAddNewBoat(){
			this.dtoAddNewBoat = {
				offerName: "",
				country: "",
				city: "",
				street: "",
				streetNumber: "",
				longitude: 19.84,
				latitude: 45.25,
				description: "",
				unitPrice: 0,
				maxCustomerCapacity: 0,
				rulesOfConduct: "",
				cancellationPolicy: "",
				boatType: "",
				boatLength: 0,
				numberOfEngines: 0,
				power: 0,
				maxSpeed: 0,
				additionalServices: [],
				image: [],
				imageCount: 0,
				imagesFrontend: []
			};
		},
		backButton: function(){
			this.resetAddNewBoat();
			this.showPage = 0;
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
		loadBoatTimeSlots(boat){
			axios.get('/api/getTermsByOfferId/' + boat.id)
			.then(response => {
				this.boatTimeSlots = response.data || [];
				this.boatTimeSlots.forEach((element, index) => {
					this.boatTimeSlots[index].startTime = String(element.startTime || '').replace("T", " ");
					this.boatTimeSlots[index].endTime = String(element.endTime || '').replace("T", " ");
				});
			});
		},
		showUpdateAvailableTerms: function(boat){
			this.selectedBoat = boat;
			this.selectedBoatLocation = boat.location || {};
			this.loadBoatTimeSlots(this.selectedBoat);
			this.showPage = 5;
			this.$nextTick(() => this.initDateRangePicker());
		},
		addNewTimeSlotToBoat(){
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
				axios.post('/api/addNewTermToOffer/' + this.selectedBoat.id , this.dataToSend_AvailbleTimeSlot)
				.then(response => {
					if(response.data === true){
						Swal.fire('Added available time slot successfully!', 'Hurray!!', 'success')
						this.showUpdateAvailableTerms(this.selectedBoat)
					}
					else{ Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error') }
				}).catch( () => Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error') )
			}
		},
		multipleDateRangeOverlaps(){
			let timeIntervals = this.boatTimeSlots
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
		formatLocalDateTime(val){
			if (!val) return '';
			return val.length === 16 ? val + ':00' : val;
		},
		showEditBoat: function(boat){
			this.selectedBoat = boat;
			var loc = boat.location || {};
			var engine = boat.engine || {};
			var services = boat.additionalServices || [];
			this.dtoEditBoat = {
				offerName: boat.offerName || "",
				country: loc.country || "",
				city: loc.city || "",
				street: loc.street || "",
				streetNumber: loc.streetNumber || "",
				longitude: loc.longitude != null ? loc.longitude : 19.84,
				latitude: loc.latitude != null ? loc.latitude : 45.25,
				description: boat.description || "",
				unitPrice: boat.unitPrice || 0,
				maxCustomerCapacity: boat.maxCustomerCapacity || 0,
				rulesOfConduct: boat.rulesOfConduct || "",
				cancellationPolicy: boat.cancellationPolicy || "",
				boatType: boat.boatType || "",
				boatLength: boat.boatLength || 0,
				numberOfEngines: engine.numberOfEngines || 0,
				power: engine.power || 0,
				maxSpeed: engine.maxSpeed || 0,
				additionalServices: Array.isArray(services) ? services.slice() : Object.values(services || {}),
				image: []
			};
			this.showPage = 3;
		},
		isEditServiceSelected: function(additionalServ){
			return (this.dtoEditBoat.additionalServices || []).some(function(s){ return s.id == additionalServ.id; });
		},
		clickEditAdditionalServ: function(additionalServ){
			for (var i = 0; i < this.dtoEditBoat.additionalServices.length; i++) {
				if (this.dtoEditBoat.additionalServices[i].id == additionalServ.id) {
					this.dtoEditBoat.additionalServices.splice(i, 1);
					return;
				}
			}
			this.dtoEditBoat.additionalServices.push(additionalServ);
		},
		submitEditBoat: function(){
			if (!this.dtoEditBoat.offerName || !this.dtoEditBoat.country || !this.dtoEditBoat.city) {
				Swal.fire('Please fill the form properly!', 'Required fields are missing.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerName: this.dtoEditBoat.offerName,
				country: this.dtoEditBoat.country,
				city: this.dtoEditBoat.city,
				street: this.dtoEditBoat.street,
				streetNumber: this.dtoEditBoat.streetNumber,
				longitude: Number(this.dtoEditBoat.longitude) || 19.84,
				latitude: Number(this.dtoEditBoat.latitude) || 45.25,
				description: this.dtoEditBoat.description,
				unitPrice: Number(this.dtoEditBoat.unitPrice),
				maxCustomerCapacity: Number(this.dtoEditBoat.maxCustomerCapacity),
				rulesOfConduct: this.dtoEditBoat.rulesOfConduct,
				cancellationPolicy: this.dtoEditBoat.cancellationPolicy,
				boatType: this.dtoEditBoat.boatType,
				boatLength: Number(this.dtoEditBoat.boatLength),
				numberOfEngines: Number(this.dtoEditBoat.numberOfEngines),
				power: Number(this.dtoEditBoat.power),
				maxSpeed: Number(this.dtoEditBoat.maxSpeed),
				additionalServices: this.dtoEditBoat.additionalServices,
				image: this.dtoEditBoat.image || []
			};
			axios.put('/api/updateBoat/' + this.selectedBoat.id, payload)
				.then(response => {
					if (response.data === true) {
						Swal.fire('Boat updated!', 'Changes saved.', 'success');
						this.showPage = 0;
						this.loadOwnersBoats();
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
		showCreateAction: function(boat){
			this.selectedBoat = boat;
			this.quickAction = {
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				totalPrice: boat.unitPrice || 0,
				discount: 0,
				additionalServices: ''
			};
			this.loadOfferActions(boat.id);
			this.showPage = 7;
		},
		submitQuickAction: function(){
			if (!this.quickAction.startDate) {
				Swal.fire('Missing fields', 'Start date is required.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerId: String(this.selectedBoat.id),
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
						this.loadOfferActions(this.selectedBoat.id);
					} else {
						Swal.fire('Could not create action', 'Check overlaps or ownership.', 'error');
					}
				})
				.catch(() => Swal.fire('Could not create action', 'Please try again later.', 'error'));
		},
		addNewBoat: function(){
			if (!this.isValidAddNewBoatDto()) {
				Swal.fire('Please fill the form properly!', 'All required fields must be completed.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerName: this.dtoAddNewBoat.offerName,
				country: this.dtoAddNewBoat.country,
				city: this.dtoAddNewBoat.city,
				street: this.dtoAddNewBoat.street,
				streetNumber: this.dtoAddNewBoat.streetNumber,
				description: this.dtoAddNewBoat.description,
				unitPrice: Number(this.dtoAddNewBoat.unitPrice),
				maxCustomerCapacity: Number(this.dtoAddNewBoat.maxCustomerCapacity),
				rulesOfConduct: this.dtoAddNewBoat.rulesOfConduct,
				cancellationPolicy: this.dtoAddNewBoat.cancellationPolicy,
				boatType: this.dtoAddNewBoat.boatType,
				boatLength: Number(this.dtoAddNewBoat.boatLength),
				numberOfEngines: Number(this.dtoAddNewBoat.numberOfEngines),
				power: Number(this.dtoAddNewBoat.power),
				maxSpeed: Number(this.dtoAddNewBoat.maxSpeed),
				longitude: Number(this.dtoAddNewBoat.longitude) || 19.84,
				latitude: Number(this.dtoAddNewBoat.latitude) || 45.25,
				additionalServices: this.dtoAddNewBoat.additionalServices,
				image: this.dtoAddNewBoat.image
			};
			axios.post('/api/addNewBoat', payload)
				.then(response => {
					if (response.data === true) {
						Swal.fire('Boat added successfully!', 'Your boat listing is now available.', 'success');
						this.resetAddNewBoat();
						this.showPage = 0;
						this.loadOwnersBoats();
					} else {
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					}
				})
				.catch(function(){
					Swal.fire('Something went wrong!', 'Please try again later.', 'error');
				});
		},
		isValidAddNewBoatDto(){
			var d = this.dtoAddNewBoat;
			return !!(d.offerName && d.country && d.city && d.street && d.streetNumber
				&& d.description && d.rulesOfConduct && d.cancellationPolicy && d.boatType
				&& d.unitPrice > 0 && d.maxCustomerCapacity > 0 && d.boatLength > 0
				&& d.numberOfEngines > 0 && d.power > 0 && d.maxSpeed > 0);
		},
		clickAdditionalServ(additionalServ){
			for (var i = 0; i < this.dtoAddNewBoat.additionalServices.length; i++) {
				if (this.dtoAddNewBoat.additionalServices[i].id == additionalServ.id) {
					this.dtoAddNewBoat.additionalServices.splice(i, 1);
					return;
				}
			}
			this.dtoAddNewBoat.additionalServices.push(additionalServ);
		},
		showAddNewBoatForm: function(){
			this.showPage = 1;
		},
		showDetails: function(boat){
			this.selectedBoat = boat;
			this.selectedBoatLocation = boat.location || {};
			this.showPage = 2;
			var self = this;
			this.$nextTick(function(){
				self.initMap('owner-boat-map', boat.location);
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
		showBookForClient: function(boat){
			this.selectedBoat = boat;
			this.bookClient = { customerEmail: '', termId: '', startDate: '', duration: 1, numberOfPeople: 1, additionalServices: '' };
			this.loadBoatTimeSlots(boat);
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
				offerId: String(this.selectedBoat.id),
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
		deleteOffer: function(boat){
			Swal.fire({
				title: 'Delete this boat?',
				text: 'Blocked if there are active reservations.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Delete'
			}).then((result) => {
				if(!result.isConfirmed) return;
				axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
				axios.post('/api/deleteMyOffer', { id: String(boat.id) })
					.then(response => {
						if(response.data === true){
							Swal.fire('Deleted', 'Offer removed.', 'success');
							this.loadOwnersBoats();
						} else {
							Swal.fire('Cannot delete', 'Offer may have active reservations.', 'error');
						}
					})
					.catch(() => Swal.fire('Cannot delete', 'Please try again later.', 'error'));
			});
		},
		search: function(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/allMyBoats').then(response => {
				var all = response.data || [];
				var name = (this.searchParams.boatName || "").toLowerCase();
				var loc = (this.searchParams.boatLocation || "").toLowerCase();
				this.myBoats = all.filter(function(boat){
					var matchName = !name || (boat.offerName && boat.offerName.toLowerCase().indexOf(name) !== -1);
					var city = boat.location && boat.location.city ? boat.location.city.toLowerCase() : "";
					var country = boat.location && boat.location.country ? boat.location.country.toLowerCase() : "";
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
				this.myBoats.sort(function(a, b){
					if (a.offerName > b.offerName) return -1;
					if (a.offerName < b.offerName) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'AscAlpha') {
				this.myBoats.sort(function(a, b){
					if (a.offerName < b.offerName) return -1;
					if (a.offerName > b.offerName) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'AscRating') {
				this.myBoats.sort(function(a, b){
					if (a.rating > b.rating) return -1;
					if (a.rating < b.rating) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'DescRating') {
				this.myBoats.sort(function(a, b){
					if (a.rating < b.rating) return -1;
					if (a.rating > b.rating) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'AscPrice') {
				this.myBoats.sort(function(a, b){
					if (a.unitPrice > b.unitPrice) return -1;
					if (a.unitPrice < b.unitPrice) return 1;
					return 0;
				});
			}
			if (this.sortOption === 'DescPrice') {
				this.myBoats.sort(function(a, b){
					if (a.unitPrice < b.unitPrice) return -1;
					if (a.unitPrice > b.unitPrice) return 1;
					return 0;
				});
			}
		}
	}
});
