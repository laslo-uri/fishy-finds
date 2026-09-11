Vue.component('register', {
	data: function(){
		return{
		    dto : {
                firstName: "",
		        lastName: "",
		        dateOfBirth: "",
		        address: "",
		        city: "",
		        country: "",
		        phoneNumber: "",
		        email: "",
		        password: "",
                userType: "",
                reasoning: "",
		    },
		    confirmPassword : "",
		    enabled: false,
		    backgroundColor: "#ed1c24",
            registrationTitle: "",
		    cursorStyle: "default",
            showForm: 0,
		}
	},
template: `
		<div class="ff-catalog">
            <nav-bar></nav-bar>
            <section class="ff-catalog__shell">
                <div class="ff-section-head">
                    <h2>Registration</h2>
                    <p>Create a FishyFinds account as a guest or service provider.</p>
                </div>

                <div class="ff-role-grid">
                    <button type="button" class="ff-role-card" @click="registerCustomer">
                        <img src="images/hero-harbor.png" alt="">
                        <strong>Customer</strong>
                        <span>Book stays, boats, and courses</span>
                    </button>
                    <button type="button" class="ff-role-card" @click="registerBungalowOwner">
                        <img src="images/homepage-bungalows.png" alt="">
                        <strong>Bungalow owner</strong>
                        <span>List and manage bungalows</span>
                    </button>
                    <button type="button" class="ff-role-card" @click="registerBoatOwner">
                        <img src="images/homepage-boats.png" alt="">
                        <strong>Boat owner</strong>
                        <span>List and manage boats</span>
                    </button>
                    <button type="button" class="ff-role-card" @click="registerInstructor">
                        <img src="images/homepage-courses.png" alt="">
                        <strong>Instructor</strong>
                        <span>Publish fishing courses</span>
                    </button>
                </div>

                <div class="ff-detail" v-show="showForm == 1 || showForm == 2 || showForm == 3" style="margin-top:1.5rem;">
                    <h3 class="ff-detail__title">{{ registrationTitle }}</h3>
                    <div class="ff-form-grid">
                        <input type="text" placeholder="First name" class="ff-field" v-model="dto.firstName"/>
                        <input type="text" placeholder="Last name" class="ff-field" v-model="dto.lastName"/>
                        <input type="text" placeholder="Address" class="ff-field" v-model="dto.address"/>
                        <input type="text" placeholder="City" class="ff-field" v-model="dto.city"/>
                        <input type="text" placeholder="Country" class="ff-field" v-model="dto.country"/>
                        <input type="text" placeholder="Phone number" class="ff-field" v-model="dto.phoneNumber"/>
                        <input type="email" placeholder="E-mail" class="ff-field" v-model="dto.email"/>
                        <input type="password" placeholder="Password (min 8)" class="ff-field" v-model="dto.password"/>
                        <input type="password" placeholder="Confirm password" class="ff-field" v-model="confirmPassword"/>
                        <textarea v-show="showForm == 2 || showForm == 3" rows="4" placeholder="Reasoning for registration" class="ff-field ff-field--wide" v-model="dto.reasoning"></textarea>
                    </div>
                    <button
                        type="button"
                        class="ff-btn ff-btn--primary"
                        :disabled="!isComplete"
                        :style="{'background-color':backgroundColor, 'cursor':cursorStyle, 'margin-top':'1rem'}"
                        @click="registerUser">Register</button>
                </div>
            </section>
		</div>
		`,
	computed : {
	      isComplete () {
        		    correctFirstName = /\S/.test(this.dto.firstName) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,0-9]{1,20}$/.test(this.dto.firstName);
        		    correctLastName = /\S/.test(this.dto.lastName) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,0-9]{1,20}$/.test(this.dto.lastName);
                    correctPhoneNumber = /\S/.test(this.dto.phoneNumber) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,A-Za-z]{8,10}$/.test(this.dto.phoneNumber);
        		    flag = correctFirstName && correctLastName && correctPhoneNumber &&
        		    /\S/.test(this.dto.address) &&
        		    /\S/.test(this.dto.city) &&
        		    /\S/.test(this.dto.country) &&
        		    /\S/.test(this.dto.email) &&
        		    /\S/.test(this.dto.password) &&
        		    /\S/.test(this.confirmPassword)
        		    && this.dto.password.length >= 8;

        		    this.backgroundColor = flag ? "#ed1c24" : "#c9a0a2";
        		    this.cursorStyle = flag ? "pointer" : "default";
        		    return flag;
        		  }
	},
    methods: {
        registerUser : function(){
            if(this.confirmPassword == this.dto.password){
                axios.post('/api/registerUser', this.dto)
                	 .then(response => {
                	            if(response.data === true){
                	                Swal.fire('Registered successfully!',
                	                          'Please check your email for further instructions.',
                	                          'success')
                	            }
                	            else{
                	                Swal.fire('Something went wrong!',
                	                           'Please try again later.',
                	                           'error')
                	            }
                	        })
            }
            else{
                Swal.fire('Passwords do not match!', '', 'error')
            }
        },
        registerCustomer : function(){
            this.showForm = 1;
            this.dto.userType = "CUSTOMER";
            this.registrationTitle = "Customer registration";
        },
        registerBungalowOwner : function(){
            this.showForm = 2;
            this.dto.userType = "BUNGALOW_OWNER";
            this.registrationTitle = "Bungalow owner registration";
        },
        registerBoatOwner : function(){
            this.showForm = 2;
            this.dto.userType = "BOAT_OWNER";
            this.registrationTitle = "Boat owner registration";
        },
        registerInstructor : function(){
            this.showForm = 3;
            this.dto.userType = "INSTRUCTOR";
            this.registrationTitle = "Instructor registration";
        }
    }
});
