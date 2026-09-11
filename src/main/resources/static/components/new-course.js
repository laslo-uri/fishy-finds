Vue.component('new-course', {
	data: function(){
		return{
			dto: {
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
			allAdditionalServices: [],
			imagesFrontend: []
		};
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Create a new course</h2>
					<p>Publish a fishing course with location, pricing, and gallery.</p>
				</div>
				<div class="ff-detail">
					<div class="ff-form-grid">
						<label class="ff-control">
							<span>Course title</span>
							<input class="ff-field" type="text" placeholder="e.g. Coastal casting" v-model="dto.offerName" />
						</label>
						<label class="ff-control">
							<span>Country</span>
							<input class="ff-field" type="text" placeholder="Country" v-model="dto.country" />
						</label>
						<label class="ff-control">
							<span>City</span>
							<input class="ff-field" type="text" placeholder="City" v-model="dto.city" />
						</label>
						<label class="ff-control">
							<span>Street</span>
							<input class="ff-field" type="text" placeholder="Street" v-model="dto.street" />
						</label>
						<label class="ff-control">
							<span>Street number</span>
							<input class="ff-field" type="text" placeholder="No." v-model="dto.streetNumber" />
						</label>
						<label class="ff-control">
							<span>Unit price</span>
							<input class="ff-field" type="number" placeholder="Price" v-model="dto.unitPrice" />
						</label>
						<label class="ff-control">
							<span>Max capacity</span>
							<input class="ff-field" type="number" placeholder="Guests" v-model="dto.maxCustomerCapacity" />
						</label>
						<label class="ff-control ff-field--wide">
							<span>Description</span>
							<textarea class="ff-field" rows="3" placeholder="What guests will learn" v-model="dto.description"></textarea>
						</label>
						<label class="ff-control ff-field--wide">
							<span>Rules of conduct</span>
							<textarea class="ff-field" rows="3" placeholder="House rules" v-model="dto.rulesOfConduct"></textarea>
						</label>
						<label class="ff-control ff-field--wide">
							<span>Cancellation policy</span>
							<textarea class="ff-field" rows="3" placeholder="Refund rules" v-model="dto.cancellationPolicy"></textarea>
						</label>
						<div class="ff-field--wide">
							<p class="ff-product__meta" style="margin-bottom:0.5rem;">Additional services</p>
							<label v-for="a in allAdditionalServices" :key="a.id" style="display:block; margin-bottom:0.35rem;">
								<input type="checkbox" :id="'svc-' + a.id" @change="toggleService(a, $event)" />
								{{ a.name }}
							</label>
						</div>
						<div class="ff-field--wide">
							<input type="file" multiple @change="imageSelected" />
							<div class="ff-gallery" style="margin-top:0.75rem;">
								<div v-for="(img, ind) in imagesFrontend" :key="ind" style="position:relative;">
									<img :src="img.path" alt="Preview" />
									<button type="button" class="ff-btn ff-btn--ink" style="margin-top:0.35rem;" @click="removeImage(ind)">Remove</button>
								</div>
							</div>
						</div>
					</div>
					<div class="ff-detail__toolbar" style="margin-top:1rem;">
						<button type="button" class="ff-btn ff-btn--primary" @click="addNewCourse">Create course</button>
						<a href="/my-courses" class="ff-btn ff-btn--ink" style="text-decoration:none;">Cancel</a>
					</div>
				</div>
			</section>
		</div>
	`,
	methods: {
		toggleService: function(service, event){
			if (event.target.checked) {
				this.dto.additionalServices.push(service);
			} else {
				for (var i = 0; i < this.dto.additionalServices.length; i++) {
					if (this.dto.additionalServices[i].id == service.id) {
						this.dto.additionalServices.splice(i, 1);
						return;
					}
				}
			}
		},
		imageSelected: function(event){
			var files = event.target.files;
			var self = this;
			for (var i = 0; i < files.length; i++) {
				(function(file){
					var reader = new FileReader();
					reader.onloadend = function(){
						self.dto.image.push(reader.result);
						self.imagesFrontend.push({ path: URL.createObjectURL(file) });
					};
					reader.readAsDataURL(file);
				})(files[i]);
			}
		},
		removeImage: function(index){
			this.dto.image.splice(index, 1);
			this.imagesFrontend.splice(index, 1);
		},
		addNewCourse: function(){
			if (!this.dto.offerName || !this.dto.country || !this.dto.city || !this.dto.street
				|| !this.dto.streetNumber || !this.dto.description || !this.dto.rulesOfConduct
				|| !this.dto.cancellationPolicy || !this.dto.unitPrice || !this.dto.maxCustomerCapacity) {
				Swal.fire('Please fill the form properly!', 'All required fields must be completed.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			var payload = {
				offerName: this.dto.offerName,
				country: this.dto.country,
				city: this.dto.city,
				street: this.dto.street,
				streetNumber: this.dto.streetNumber,
				description: this.dto.description,
				unitPrice: Number(this.dto.unitPrice),
				maxCustomerCapacity: Number(this.dto.maxCustomerCapacity),
				rulesOfConduct: this.dto.rulesOfConduct,
				cancellationPolicy: this.dto.cancellationPolicy,
				additionalServices: this.dto.additionalServices,
				image: this.dto.image
			};
			var self = this;
			axios.post('/api/addNewCourse', payload)
				.then(function(response){
					if (response.data === true) {
						Swal.fire('Course created successfully!', 'Your course is now available.', 'success')
							.then(function(){
								self.$router.push('/my-courses');
							});
					} else {
						Swal.fire('Something went wrong!', 'Please try again later.', 'error');
					}
				})
				.catch(function(){
					Swal.fire('Something went wrong!', 'Please try again later.', 'error');
				});
		}
	},
	mounted(){
		axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
		axios.get('/api/getAllAdditionalServicesForBoatsAndCourses')
			.then(response => {
				this.allAdditionalServices = response.data || [];
			});
	}
});
