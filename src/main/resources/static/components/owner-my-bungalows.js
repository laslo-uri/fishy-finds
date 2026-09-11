Vue.component('owner-my-bungalows', {
	data: function(){
		return{	
			loggedUser: { userType: '' },
			
			myBungalows:[],
			allImages:[],

			allAdditionalServices: [],
			bungalowTimeSlots: [],

			showPage: 0,
			sortOption: "",
			searchParams: {
				bungalowName : "",
				bungalowLocation: ""
			},

			selectedBungalow:{},
			selectedBungalowsLocation:{},
			selectedBungalowsOwner:{},

			dtoAddNewBungalow: {
				offerType: "BUNGALOW",
				offerName: "",

				country: "",
				city: "",
				street: "",
				streetNumber:"",

				longitude: 45.24,
				latitude: 19.82,

				description:"",
				unitPrice: 0 ,
				maxCustomerCapacity:0,
				numberOfRooms: 0,
				numberOfBeds: 0,

				rulesOfConduct:"",
				additionalServices: [],
				cancellationPolicy:"",
				image: [],

				imageCount: 0,
				imagesFrontend: []

			},

			dataToSend_AvailbleTimeSlot:{
				startTime:"",
				endTime:""

			},

			bookClient: {
				customerEmail: '',
				termId: '',
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				additionalServices: ''
			},

			dtoEditBungalow: {
				offerType: "BUNGALOW",
				offerName: "",
				country: "",
				city: "",
				street: "",
				streetNumber:"",
				longitude: 45.24,
				latitude: 19.82,
				description:"",
				unitPrice: 0 ,
				maxCustomerCapacity:0,
				numberOfRooms: 0,
				numberOfBeds: 0,
				rulesOfConduct:"",
				additionalServices: [],
				cancellationPolicy:"",
				image: []
			},

			offerActions: [],
			quickAction: {
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				totalPrice: 0,
				discount: 0,
				additionalServices: ''
			},

			map: {},
			backgroundColor: {},
			cursorStyle: {},

		}
	},
template: `
<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell" v-if="loggedUser.userType == 'BUNGALOW_OWNER'">
				<div class="ff-section-head">
					<h2>My bungalows</h2>
					<p>Search, sort, and manage your coastal bungalow listings.</p>
				</div>

				<div v-show="showPage == 0">
					<div class="ff-filters">
						<div class="ff-filters__row">
							<label class="ff-control">
								<span>Bungalow name</span>
								<input v-model="searchParams.bungalowName" class="ff-field" type="text" placeholder="Search by name" />
							</label>
							<label class="ff-control">
								<span>Location</span>
								<input v-model="searchParams.bungalowLocation" class="ff-field" type="text" placeholder="City or country" />
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
								<button type="button" class="ff-btn ff-btn--ink" @click="showAddNewBungalowForm">Add bungalow</button>
							</div>
						</div>
					</div>

					<div class="ff-product-grid">
						<article class="ff-product" v-for="bungalow in myBungalows" :key="bungalow.id">
							<div class="ff-product__media">
								<img v-if="bungalow.images && bungalow.images.length" :src="coverPath(bungalow)" :alt="bungalow.offerName" />
								<img v-else src="images/no-pictures.jpg" alt="No photo" />
							</div>
							<div class="ff-product__body">
								<h3>{{ bungalow.offerName }}</h3>
								<p class="ff-product__meta">{{ bungalow.unitPrice }} $ | * {{ bungalow.rating }} | {{ bungalow.location ? bungalow.location.city : '' }}</p>
								<p>{{ bungalow.description }}</p>
								<div class="ff-product__actions">
									<button type="button" class="ff-btn ff-btn--primary" @click="showDetails(bungalow)">Details</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showUpdateAvailableTerms(bungalow)">Terms</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showEditBungalow(bungalow)">Edit</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showCreateAction(bungalow)">Actions</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="showBookForClient(bungalow)">Book for client</button>
									<button type="button" class="ff-btn ff-btn--ink" @click="deleteOffer(bungalow)">Delete</button>
								</div>
							</div>
						</article>
					</div>
					<p v-if="!myBungalows.length" class="ff-empty">No bungalows found.</p>
				</div>

				<div v-show="showPage == 1">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Add a new bungalow</h3>
						<div class="ff-form-grid">
							<input type="text" placeholder="Bungalow name" class="ff-field" v-model="dtoAddNewBungalow.offerName" />
							<input type="text" placeholder="Country" class="ff-field" v-model="dtoAddNewBungalow.country" />
							<input type="text" placeholder="City" class="ff-field" v-model="dtoAddNewBungalow.city" />
							<input type="text" placeholder="Street" class="ff-field" v-model="dtoAddNewBungalow.street" />
							<input type="text" placeholder="Street number" class="ff-field" v-model="dtoAddNewBungalow.streetNumber" />
							<input type="number" placeholder="Unit price" class="ff-field" v-model="dtoAddNewBungalow.unitPrice" />
							<input type="number" placeholder="Maximum capacity" class="ff-field" v-model="dtoAddNewBungalow.maxCustomerCapacity" />
							<input type="number" placeholder="Number of rooms" class="ff-field" v-model="dtoAddNewBungalow.numberOfRooms" />
							<input type="number" placeholder="Number of beds" class="ff-field" v-model="dtoAddNewBungalow.numberOfBeds" />
							<textarea rows="3" placeholder="Description" class="ff-field ff-field--wide" v-model="dtoAddNewBungalow.description"></textarea>
							<div class="ff-field--wide">
								<p class="ff-product__meta">Additional services</p>
								<label v-for="additionalServ in allAdditionalServices" :key="additionalServ.id" style="display:block; margin-bottom:0.25rem;">
									<span v-if="additionalServ.type == 'ADDITIONAL_SERVICE'">
										<input type="checkbox" v-on:click="clickAdditionalServ(additionalServ)" /> {{ additionalServ.name }}
									</span>
								</label>
							</div>
							<textarea rows="3" placeholder="Rules of conduct" class="ff-field ff-field--wide" v-model="dtoAddNewBungalow.rulesOfConduct"></textarea>
							<textarea rows="3" placeholder="Cancellation policy" class="ff-field ff-field--wide" v-model="dtoAddNewBungalow.cancellationPolicy"></textarea>
							<div class="ff-field--wide">
								<input type="file" name="file[]" @change="imageSelected" multiple="multiple" />
								<div class="ff-gallery" style="margin-top:0.75rem;">
									<div v-for="(image, ind) in dtoAddNewBungalow.imagesFrontend" :key="ind">
										<img :src="image.path" alt="Preview" />
										<button type="button" class="ff-btn ff-btn--ink" @click="removeImage(image, ind)">Remove</button>
									</div>
								</div>
							</div>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" :style="{'background-color':backgroundColor, 'cursor':cursorStyle}" @click="addNewBungalow()">Add new bungalow</button>
						</div>
					</div>
				</div>

				<div v-show="showPage == 2">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">{{ selectedBungalow.offerName }}</h3>
						<div class="ff-detail__grid">
							<div><span>Country</span><strong>{{ selectedBungalowsLocation.country }}</strong></div>
							<div><span>City</span><strong>{{ selectedBungalowsLocation.city }}</strong></div>
							<div><span>Street</span><strong>{{ selectedBungalowsLocation.street }} {{ selectedBungalowsLocation.streetNumber }}</strong></div>
							<div><span>Unit price</span><strong>{{ selectedBungalow.unitPrice }}</strong></div>
							<div><span>Capacity</span><strong>{{ selectedBungalow.maxCustomerCapacity }}</strong></div>
							<div><span>Rooms</span><strong>{{ selectedBungalow.numberOfRooms }}</strong></div>
							<div><span>Beds</span><strong>{{ selectedBungalow.numberOfBeds }}</strong></div>
							<div class="ff-detail__wide"><span>Description</span><strong>{{ selectedBungalow.description }}</strong></div>
							<div class="ff-detail__wide"><span>Services</span>
								<strong>
									<span v-for="(additionalServ, i) in (selectedBungalow.additionalServices || [])" :key="i">{{ additionalServ.name }}<span v-if="i < (selectedBungalow.additionalServices || []).length - 1">, </span></span>
								</strong>
							</div>
							<div class="ff-detail__wide"><span>Rules</span><strong>{{ selectedBungalow.rulesOfConduct }}</strong></div>
							<div class="ff-detail__wide"><span>Cancellation</span><strong>{{ selectedBungalow.cancellationPolicy }}</strong></div>
						</div>
						<div id="owner-bungalow-map" class="ff-offer-map"></div>
						<div class="ff-gallery" style="margin-top:1rem;">
							<img v-for="(image, ind) in selectedBungalow.images" :key="ind" :src="setImage(image)" alt="Bungalow photo" />
						</div>
					</div>
				</div>

				<div v-show="showPage == 3">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Edit bungalow: {{ selectedBungalow.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="text" placeholder="Bungalow name" class="ff-field" v-model="dtoEditBungalow.offerName" />
							<input type="text" placeholder="Country" class="ff-field" v-model="dtoEditBungalow.country" />
							<input type="text" placeholder="City" class="ff-field" v-model="dtoEditBungalow.city" />
							<input type="text" placeholder="Street" class="ff-field" v-model="dtoEditBungalow.street" />
							<input type="text" placeholder="Street number" class="ff-field" v-model="dtoEditBungalow.streetNumber" />
							<input type="number" placeholder="Unit price" class="ff-field" v-model="dtoEditBungalow.unitPrice" />
							<input type="number" placeholder="Maximum capacity" class="ff-field" v-model="dtoEditBungalow.maxCustomerCapacity" />
							<input type="number" placeholder="Number of rooms" class="ff-field" v-model="dtoEditBungalow.numberOfRooms" />
							<input type="number" placeholder="Number of beds" class="ff-field" v-model="dtoEditBungalow.numberOfBeds" />
							<textarea rows="3" placeholder="Description" class="ff-field ff-field--wide" v-model="dtoEditBungalow.description"></textarea>
							<div class="ff-field--wide">
								<p class="ff-product__meta">Additional services</p>
								<label v-for="additionalServ in allAdditionalServices" :key="'edit-' + additionalServ.id" style="display:block; margin-bottom:0.25rem;">
									<span v-if="additionalServ.type == 'ADDITIONAL_SERVICE'">
										<input type="checkbox" :checked="isEditServiceSelected(additionalServ)" v-on:click="clickEditAdditionalServ(additionalServ)" /> {{ additionalServ.name }}
									</span>
								</label>
							</div>
							<textarea rows="3" placeholder="Rules of conduct" class="ff-field ff-field--wide" v-model="dtoEditBungalow.rulesOfConduct"></textarea>
							<textarea rows="3" placeholder="Cancellation policy" class="ff-field ff-field--wide" v-model="dtoEditBungalow.cancellationPolicy"></textarea>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" @click="submitEditBungalow">Save changes</button>
						</div>
					</div>
				</div>

				<div v-show="showPage == 5">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="backButton()">Close</button>
						</div>
						<h3 class="ff-detail__title">Update available terms: {{ selectedBungalow.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="text" id="picker" name="daterange" class="ff-field ff-field--wide" />
							<div class="ff-detail__wide"><span>Start date</span><strong id="startDate"> ...... </strong></div>
							<div class="ff-detail__wide"><span>End date</span><strong id="endDate"> ...... </strong></div>
						</div>
						<div class="ff-detail__toolbar" style="margin-top:1rem;">
							<button type="button" class="ff-btn ff-btn--primary" :style="{'background-color':backgroundColor, 'cursor':cursorStyle}" @click="addNewTimeSlotToBungalow(selectedBungalow)">Add new available time slot</button>
						</div>
						<h3 class="ff-detail__title" style="margin-top:1.5rem;">Available terms</h3>
						<div class="ff-term" v-for="timeSlot in bungalowTimeSlots" :key="timeSlot.id || (timeSlot.startTime + timeSlot.endTime)">
							<p>Start: {{ timeSlot.startTime }}</p>
							<p>End: {{ timeSlot.endTime }}</p>
						</div>
						<p v-if="!bungalowTimeSlots.length" class="ff-empty">No terms listed.</p>
					</div>
				</div>

				<div v-show="showPage == 6">
					<div class="ff-detail">
						<div class="ff-detail__toolbar">
							<button type="button" class="ff-btn ff-btn--ink" @click="showPage = 0">Close</button>
						</div>
						<h3 class="ff-detail__title">Book for client: {{ selectedBungalow.offerName }}</h3>
						<div class="ff-form-grid">
							<input type="email" class="ff-field ff-field--wide" placeholder="Client email" v-model="bookClient.customerEmail" />
							<select class="ff-field ff-field--wide" v-model="bookClient.termId">
								<option disabled value="">Select available term</option>
								<option v-for="t in bungalowTimeSlots" :key="t.id" :value="t.id">{{ t.startTime }} → {{ t.endTime }}</option>
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
						<h3 class="ff-detail__title">Quick actions: {{ selectedBungalow.offerName }}</h3>
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
	computed:{
		axiosSearchParams() {
			const params = new URLSearchParams();
			params.append('name', this.searchParams.bungalowName);
			params.append('location', this.searchParams.bungalowLocation);
			params.append('type', 'BUNGALOW');
			return params;
		},
	},
	methods:{
		loadData(){
			try {
				this.loggedUser = JSON.parse(window.localStorage.getItem('loggedUser')) || { userType: '' };
			} catch (e) {
				this.loggedUser = { userType: '' };
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get("/api/authenticateUser")
				.then(response => { this.loggedUser = response.data || this.loggedUser; })
				.catch(() => {});
			this.loadOwnersBungalows();
			this.loadAllAdditionalServices();
		}
		,
        imageSelected(event){
        	const file = document.querySelector('input[type=file]')
			var readers = new Array(file.files.length)
			for(var i = 0; i < file.files.length; ++i){
				readers[i] = new FileReader();
				readers[i].name = i;
			}
			var i = 0;
			var j = 0;
			while(i < file.files.length){
				var cFile = file.files[i];
				if(cFile != null){
					let rawImg;
					this.imagePath = true;
					readers[i].onloadend = () => {
						this.dtoAddNewBungalow.image.push(readers[j].result);
						this.dtoAddNewBungalow.imageCount++;
						this.dtoAddNewBungalow.imagesFrontend.push({id: this.imageCount, name:""+this.imageCount, path: URL.createObjectURL(cFile)})
						alreadyLoaded = false;
						++j;     
					}
					readers[i].readAsDataURL(cFile);
					++i;
				}
				else{
					this.imagePath = false
				}
			}
        },
		removeImage: function(image, index){
			this.dtoAddNewBungalow.imageCount--;
			this.dtoAddNewBungalow.imagesFrontend.splice(index,1);
			this.dtoAddNewBungalow.image.splice(index,1);
		},
		initMap: function(targetId, location){
			var id = targetId || 'owner-bungalow-map';
			var el = document.getElementById(id);
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
				target: id,
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					})
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
				}}
				,
				function(startDate, endDate, label){
					$('#startDate').text(startDate.format('YYYY-MM-DD'))
					$('#endDate').text(endDate.format('YYYY-MM-DD'))
				});
		},
		loadOwnersBungalows(){
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/allMyBungalows').then(response => {
				this.myBungalows = response.data
				console.log(this.myBungalows)
			})
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
			if (image.path && (image.path.indexOf('images/') === 0 || image.path.indexOf('/images/') === 0 || image.path.indexOf('http') === 0)) {
				return image.path;
			}
			if (image.name) {
				return 'http://localhost:8080/api/getImage/' + image.name;
			}
			return 'images/no-pictures.jpg';
		},
		loadAllAdditionalServices(){
			axios.get('api/getAllAdditionalServicesForBungalows').then(response => {
            this.allAdditionalServices = response.data;
        	});
		},

		resetAddNewBungalow(){
			this.dtoAddNewBungalow = {
				offerType: "BUNGALOW",
				offerName: "",
				country: "",
				city: "",
				street: "",
				streetNumber:"",
				longitude: 45.24,
				latitude: 19.82,
				description:"",
				unitPrice: 0 ,
				maxCustomerCapacity:0,
				numberOfRooms: 0,
				numberOfBeds: 0,
				rulesOfConduct:"",
				additionalServices: [],
				cancellationPolicy:"",
				image: [],
				imageCount: 0,
				imagesFrontend: []
			};
		},
		loadBungalowTimeSlots(bungalow){
			//axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.get('/api/getTermsByOfferId/' + bungalow.id)
			.then(response => {
				console.log("EEE - ",response)
				this.bungalowTimeSlots = response.data
				this.bungalowTimeSlots.forEach((element,index) => {
					this.bungalowTimeSlots[index].startTime = element.startTime.replace("T", " ");
					this.bungalowTimeSlots[index].endTime = element.endTime.replace("T", " ");
					//this.bungalowTimeSlots[index].endTime = element.endTime.substring(0, element.endTime.indexOf("."))
				});
			})
		},
		backButton: function(){
			this.resetAddNewBungalow();
			this.$router.go(this.$router.currentRoute)
		},
		addNewTimeSlotToBungalow(){
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
				axios.post('/api/addNewTermToOffer/' + this.selectedBungalow.id , this.dataToSend_AvailbleTimeSlot)
				.then(response => { 
					if(response.data === true){ 
						Swal.fire('Added available time slot successfully!', 'Hurray!!', 'success')
						this.showUpdateAvailableTerms(this.selectedBungalow) }
					else{ Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error') }
				}).catch( () => Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error') )
			}
		},
		showBookForClient: function(bungalow){
			this.selectedBungalow = bungalow;
			this.bookClient = { customerEmail: '', termId: '', startDate: '', duration: 1, numberOfPeople: 1, additionalServices: '' };
			this.loadBungalowTimeSlots(bungalow);
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
				offerId: String(this.selectedBungalow.id),
				startDate: this.bookClient.startDate.length === 16 ? this.bookClient.startDate + ':00' : this.bookClient.startDate,
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
		deleteOffer: function(bungalow){
			Swal.fire({
				title: 'Delete this bungalow?',
				text: 'Blocked if there are active reservations.',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ed1c24',
				cancelButtonColor: '#1a1a1a',
				confirmButtonText: 'Delete'
			}).then((result) => {
				if(!result.isConfirmed) return;
				axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
				axios.post('/api/deleteMyOffer', { id: String(bungalow.id) })
					.then(response => {
						if(response.data === true){
							Swal.fire('Deleted', 'Offer removed.', 'success');
							this.loadOwnersBungalows();
						} else {
							Swal.fire('Cannot delete', 'Offer may have active reservations.', 'error');
						}
					})
					.catch(() => Swal.fire('Cannot delete', 'Please try again later.', 'error'));
			});
		},
		multipleDateRangeOverlaps(){
			let timeIntervals = this.bungalowTimeSlots
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
		addNewBungalow: function(){
			if(!this.isValidAddNewBungalowDto()){ 
				Swal.fire('Ooops, you must fill the form properly!', 'Please, try again later!', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.post('/api/addNewBungalow' , this.dtoAddNewBungalow)
				.then(response => { 
					if(response.data === true){ Swal.fire('Added bungalow successfuly!','Hurray!!', 'success'); this.resetAddNewBungalow();}
					else{ Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error')}
				}).catch( Swal.fire('Ooops, something went wrong!', 'Please, try again later!', 'error')
			)
			this.loadOwnersBungalows();
		},
		isValidAddNewBungalowDto() {
			for (const property in this.dtoAddNewBungalow) {
				if (property!=='imageCount' && property!=='image' && property!=='imagesFrontend' && !this.dtoAddNewBungalow[property]) {
					return false;
				}
			}
			return true;
		},
		clickAdditionalServ(additionalServ){
			for (var i = 0; i < this.dtoAddNewBungalow.additionalServices.length; i++) {
				if(this.dtoAddNewBungalow.additionalServices[i].id == additionalServ.id){
					//remove
					this.dtoAddNewBungalow.additionalServices.splice(i, 1);
					console.log("removed element from additionalServ with id="+additionalServ.id);
					return;
				}
			}
			//add
			this.dtoAddNewBungalow.additionalServices.push(additionalServ);
			console.log("added element from additionalServ with id="+additionalServ.id);
		},

		showAddNewBungalowForm: function() {
			this.showPage = 1;
		},
		showDetails: function(bungalow){
			this.selectedBungalow.images = [];
			this.selectedBungalow = bungalow;
			this.selectedBungalowsLocation = bungalow.location || {};
			this.selectedBungalowsOwner = bungalow.user || {};
			this.loadData();
			this.showPage = 2;
			var self = this;
			this.$nextTick(function(){
				self.initMap('owner-bungalow-map', bungalow.location);
			});
		},
		showUpdateAvailableTerms: function(bungalow){
			this.selectedBungalow = bungalow;
			this.selectedBungalowsLocation = bungalow.location || {};
			this.selectedBungalowsOwner = bungalow.user || {};
			this.loadBungalowTimeSlots(this.selectedBungalow);
			this.loadData();
			this.showPage = 5;
			this.initDateRangePicker();
		},
		formatLocalDateTime: function(val){
			if (!val) return '';
			return val.length === 16 ? val + ':00' : val;
		},
		showEditBungalow: function(bungalow){
			this.selectedBungalow = bungalow;
			var loc = bungalow.location || {};
			var services = bungalow.additionalServices || [];
			this.dtoEditBungalow = {
				offerType: "BUNGALOW",
				offerName: bungalow.offerName || "",
				country: loc.country || "",
				city: loc.city || "",
				street: loc.street || "",
				streetNumber: loc.streetNumber || "",
				longitude: loc.longitude != null ? loc.longitude : 45.24,
				latitude: loc.latitude != null ? loc.latitude : 19.82,
				description: bungalow.description || "",
				unitPrice: bungalow.unitPrice || 0,
				maxCustomerCapacity: bungalow.maxCustomerCapacity || 0,
				numberOfRooms: bungalow.numberOfRooms || 0,
				numberOfBeds: bungalow.numberOfBeds || 0,
				rulesOfConduct: bungalow.rulesOfConduct || "",
				additionalServices: Array.isArray(services) ? services.slice() : Object.values(services || {}),
				cancellationPolicy: bungalow.cancellationPolicy || "",
				image: []
			};
			this.showPage = 3;
		},
		isEditServiceSelected: function(additionalServ){
			return (this.dtoEditBungalow.additionalServices || []).some(function(s){ return s.id == additionalServ.id; });
		},
		clickEditAdditionalServ: function(additionalServ){
			for (var i = 0; i < this.dtoEditBungalow.additionalServices.length; i++) {
				if (this.dtoEditBungalow.additionalServices[i].id == additionalServ.id) {
					this.dtoEditBungalow.additionalServices.splice(i, 1);
					return;
				}
			}
			this.dtoEditBungalow.additionalServices.push(additionalServ);
		},
		submitEditBungalow: function(){
			if (!this.dtoEditBungalow.offerName || !this.dtoEditBungalow.country || !this.dtoEditBungalow.city) {
				Swal.fire('Please fill the form properly!', 'Required fields are missing.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerName: this.dtoEditBungalow.offerName,
				country: this.dtoEditBungalow.country,
				city: this.dtoEditBungalow.city,
				street: this.dtoEditBungalow.street,
				streetNumber: this.dtoEditBungalow.streetNumber,
				longitude: this.dtoEditBungalow.longitude,
				latitude: this.dtoEditBungalow.latitude,
				description: this.dtoEditBungalow.description,
				unitPrice: Number(this.dtoEditBungalow.unitPrice),
				maxCustomerCapacity: Number(this.dtoEditBungalow.maxCustomerCapacity),
				numberOfRooms: Number(this.dtoEditBungalow.numberOfRooms),
				numberOfBeds: Number(this.dtoEditBungalow.numberOfBeds),
				rulesOfConduct: this.dtoEditBungalow.rulesOfConduct,
				cancellationPolicy: this.dtoEditBungalow.cancellationPolicy,
				additionalServices: this.dtoEditBungalow.additionalServices,
				image: this.dtoEditBungalow.image || []
			};
			axios.put('/api/updateBungalow/' + this.selectedBungalow.id, payload)
				.then(response => {
					if (response.data === true) {
						Swal.fire('Bungalow updated!', 'Changes saved.', 'success');
						this.showPage = 0;
						this.loadOwnersBungalows();
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
		showCreateAction: function(bungalow){
			this.selectedBungalow = bungalow;
			this.quickAction = {
				startDate: '',
				duration: 1,
				numberOfPeople: 1,
				totalPrice: bungalow.unitPrice || 0,
				discount: 0,
				additionalServices: ''
			};
			this.loadOfferActions(bungalow.id);
			this.showPage = 7;
		},
		submitQuickAction: function(){
			if (!this.quickAction.startDate) {
				Swal.fire('Missing fields', 'Start date is required.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerId: String(this.selectedBungalow.id),
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
						this.loadOfferActions(this.selectedBungalow.id);
					} else {
						Swal.fire('Could not create action', 'Check overlaps or ownership.', 'error');
					}
				})
				.catch(() => Swal.fire('Could not create action', 'Please try again later.', 'error'));
		},
		search : function(){
			axios.get('/api/search/' + this.loggedUser.id.toString(), {params: this.axiosSearchParams})
				.then(response => {
					this.myBungalows = response.data
				})
		},
		sortedArray: function() {
			if(this.sortOption === 'DescAlpha'){
				function compare(a, b) { 
					if (a.offerName > b.offerName) return -1;
					if (a.offerName < b.offerName) return 1;
				 	return 0;
			   }
				return this.myBungalows.sort(compare);
			}
			if(this.sortOption === 'AscAlpha'){
				 function compare(a, b) {
					if (a.offerName < b.offerName) return -1;
					if (a.offerName > b.offerName) return 1;
				 	return 0;
				 }
				 return this.myBungalows.sort(compare);
			 }
			if(this.sortOption === 'AscRating'){
				function compare(a, b) {
					if (a.rating > b.rating) return -1;
					if (a.rating < b.rating) return 1;
					return 0;
			   }
				return this.myBungalows.sort(compare);
			}
			if(this.sortOption === 'DescRating'){
				function compare(a, b) {
					if (a.rating < b.rating) return -1;
					if (a.rating > b.rating) return 1;
					return 0;
				 }
				 return this.myBungalows.sort(compare);
			 }
			if(this.sortOption === 'AscPrice'){
				function compare(a, b) {
					if (a.unitPrice > b.unitPrice) return -1;
					if (a.unitPrice < b.unitPrice) return 1;
				 	return 0;
			   }
				return this.myBungalows.sort(compare);
			}
			if(this.sortOption === 'DescPrice'){
				function compare(a, b) {
					if (a.unitPrice < b.unitPrice) return -1;
					if (a.unitPrice > b.unitPrice) return 1;
					return 0;
				}
				return this.myBungalows.sort(compare);
			}
	  	}

	}
});