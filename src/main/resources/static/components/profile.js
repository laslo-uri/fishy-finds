Vue.component('profile', {
	data: function(){
		return{
			dto: {
				id: null,
				email: '',
				firstName: '',
				lastName: '',
				address: '',
				city: '',
				country: '',
				phoneNumber: '',
				userType: '',
				earnedPoints: 0,
				loyaltyProgram: null
			},
			loaded: false,
			enable: true,
			confirmPassword: '',
			passwordDTO: {
			           id: null,
			           oldPassword: '',
			           newPassword: ''
			},
			showForm: 0,
			requestDTO:{
			    id: null,
			    explanation: ''
			}
		};
	}
	,
template: `
		<div class="ff-catalog">
		    <nav-bar></nav-bar>
            <section class="ff-catalog__shell" v-if="loaded">
                <div class="ff-section-head">
                    <h2>Your profile</h2>
                    <p>Account details, loyalty, and security options.</p>
                </div>
                <div class="ff-profile-layout">
                <div class="ff-detail">
                    <p class="ff-detail__title">Account</p>
                    <div class="ff-detail__grid">
                        <div class="ff-detail__wide"><span>Email</span><strong>{{ dto.email }}</strong></div>
                        <div><span>First name</span><strong>{{ dto.firstName }}</strong></div>
                        <div><span>Last name</span><strong>{{ dto.lastName }}</strong></div>
                        <div class="ff-detail__wide"><span>Address</span><strong>{{ dto.address }}</strong></div>
                        <div><span>City</span><strong>{{ dto.city }}</strong></div>
                        <div><span>Country</span><strong>{{ dto.country }}</strong></div>
                        <div class="ff-detail__wide"><span>Phone</span><strong>{{ dto.phoneNumber }}</strong></div>
                        <div v-if="dto.userType == 'CUSTOMER' && dto.loyaltyProgram != null"><span>Loyalty</span><strong>{{ dto.loyaltyProgram.categoryName }}</strong></div>
                        <div v-if="dto.userType == 'CUSTOMER' && dto.loyaltyProgram != null"><span>Discount</span><strong>{{ dto.loyaltyProgram.categoryDiscount }}%</strong></div>
                        <div v-if="dto.userType == 'CUSTOMER' && dto.loyaltyProgram == null"><span>Loyalty</span><strong>none</strong></div>
						<div v-if="dto.userType == 'CUSTOMER'"><span>Points</span><strong>{{ dto.earnedPoints != null ? dto.earnedPoints : 0 }}</strong></div>
                    </div>
                </div>

                    <div class="ff-detail">
                        <div v-show="showForm == 0">
                            <p class="ff-detail__title">Options</p>
                            <div class="ff-role-grid">
                                <button type="button" class="ff-role-card" @click="showForm = 1">
                                    <strong>Update profile</strong>
                                    <span>Change personal details</span>
                                </button>
                                <button type="button" class="ff-role-card" @click="showForm = 2">
                                    <strong>Change password</strong>
                                    <span>Update account security</span>
                                </button>
                                <button type="button" class="ff-role-card" v-if="dto.userType != 'ADMIN'" @click="showForm = 3">
                                    <strong>Delete account</strong>
                                    <span>Send a deletion request</span>
                                </button>
                            </div>
                        </div>

                        <div v-show="showForm == 1">
                            <p class="ff-detail__title">Update your profile</p>
                            <div class="ff-form-grid">
                                <input placeholder="First name" type="text" class="ff-field" v-model="dto.firstName"/>
                                <input placeholder="Last name" type="text" class="ff-field" v-model="dto.lastName"/>
                                <input placeholder="Address" type="text" class="ff-field" v-model="dto.address"/>
                                <input placeholder="City" type="text" class="ff-field" v-model="dto.city"/>
                                <input placeholder="Country" type="text" class="ff-field" v-model="dto.country"/>
                                <input placeholder="Phone number" type="text" class="ff-field" v-model="dto.phoneNumber"/>
                            </div>
                            <div class="ff-detail__toolbar" style="margin-top:1rem;">
                                <button type="button" class="ff-btn ff-btn--primary" :disabled="!isComplete" @click="saveProfile">Save</button>
                                <button type="button" class="ff-btn ff-btn--ink" @click="backToOptions">Back</button>
                            </div>
                        </div>

                        <div v-show="showForm == 2">
                            <p class="ff-detail__title">Change password</p>
                            <div class="ff-form-grid">
                                <input placeholder="Old password" type="password" class="ff-field" v-model="passwordDTO.oldPassword"/>
                                <input placeholder="New password" type="password" class="ff-field" v-model="passwordDTO.newPassword"/>
                                <input placeholder="Confirm new password" type="password" class="ff-field" v-model="confirmPassword"/>
                            </div>
                            <div class="ff-detail__toolbar" style="margin-top:1rem;">
                                <button type="button" class="ff-btn ff-btn--primary" :disabled="!isCompletePassword" @click="savePassword">Save</button>
                                <button type="button" class="ff-btn ff-btn--ink" @click="backToOptions">Back</button>
                            </div>
                        </div>

                        <div v-show="showForm == 3">
                            <p class="ff-detail__title">Delete account</p>
                            <textarea class="ff-field ff-field--wide" rows="4" placeholder="Explain why you want to delete the account" v-model="requestDTO.explanation"></textarea>
                            <div class="ff-detail__toolbar" style="margin-top:1rem;">
                                <button type="button" class="ff-btn ff-btn--primary" @click="sendAccountDeletionRequest">Send request</button>
                                <button type="button" class="ff-btn ff-btn--ink" @click="backToOptions">Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="ff-catalog__shell" v-else>
                <p class="ff-empty">Loading profile…</p>
            </section>
		</div>
    `
    ,
    computed : {
        isComplete () {
            correctFirstName = /\S/.test(this.dto.firstName) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,0-9]{1,20}$/.test(this.dto.firstName);
            correctLastName = /\S/.test(this.dto.lastName) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,0-9]{1,20}$/.test(this.dto.lastName);
            correctPhoneNumber = /\S/.test(this.dto.phoneNumber) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,A-Za-z]{8,10}$/.test(this.dto.phoneNumber);
            flag = correctFirstName && correctLastName && correctPhoneNumber &&
                /\S/.test(this.dto.address) &&
                /\S/.test(this.dto.city) &&
                /\S/.test(this.dto.country) &&
                /\S/.test(this.dto.email);
                return flag;
        },
        isCompletePassword () {
                flag = /\S/.test(this.passwordDTO.newPassword) && /\S/.test(this.confirmPassword) && this.passwordDTO.newPassword.length >= 8 && /\S/.test(this.passwordDTO.oldPassword);
                return flag;
        }
    },
    methods : {
        savePassword : function(){
            if(this.passwordDTO.newPassword !== this.confirmPassword){
                Swal.fire('Passwords do not match!', '', 'error');
                return;
            }
            this.passwordDTO.id = this.dto.id;
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#ed1c24',
              cancelButtonColor: '#1a1a1a',
              confirmButtonText: 'Yes, change my password!'
            }).then((result) => {
                if(result.isConfirmed){
                    axios.put('/api/changePassword', this.passwordDTO)
                         .then(response => {
                            if(response.data === true){
                                Swal.fire('Password changed successfully!', '', 'success')
                                this.backToOptions();
                            }
                            else{
                                Swal.fire('Something went wrong!', 'Please try again later.', 'error')
                            }
                         })
                    }
            })
        },
        saveProfile : function(){
             Swal.fire({
                          title: 'Are you sure?',
                          text: "You won't be able to revert this!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#ed1c24',
                          cancelButtonColor: '#1a1a1a',
                          confirmButtonText: 'Yes, update my profile!'
                        }).then((result) => {
                         if(result.isConfirmed){
                            axios.put('/api/changeProfile', {"id": this.dto.id,
                                                             "firstName":this.dto.firstName,
                                                             "lastName": this.dto.lastName,
                                                             "address": this.dto.address,
                                                             "city": this.dto.city,
                                                             "country": this.dto.country,
                                                             "phoneNumber":this.dto.phoneNumber,
                                                             "email":this.dto.email})
                            .then((response) => {
                                if(response.data){
                                    Swal.fire('Profile updated successfully!', '', 'success')
                                    .then(() => {
                                    this.backToOptions();
                                    })
                                }
                                else{
                                 Swal.fire('Something went wrong!', 'Please try again later.', 'error')
                                }
                            })
                         }
            })
        },
        sendAccountDeletionRequest : function(){
        this.requestDTO.id = this.dto.id;
             Swal.fire({
                                      title: 'Are you sure?',
                                      text: "You won't be able to revert this!",
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#ed1c24',
                                      cancelButtonColor: '#1a1a1a',
                                      confirmButtonText: 'Yes, send request!'})
             .then((result)=>{
                if(result.isConfirmed){
                    axios.defaults.headers.common["Authorization"] =
                                                         localStorage.getItem("user");

                    axios.post('/api/sendAccountDeletionRequest', this.requestDTO)
                         .then((response) => {
                             if(response.data){
                                Swal.fire('Request sent successfully!', '', 'success')
                                this.backToOptions();
                                axios.defaults.headers.common["Authorization"] =
                                localStorage.getItem("user");
                                axios.get("/api/refresh")
                                     .then(response => (window.localStorage.setItem("user", response.data)))
                             }
                             else{
                              Swal.fire('Something went wrong!', 'More than one request cannot be sent.', 'error')
                             }
                    })
                }})
        },

        backToOptions : function(){
            this.showForm = 0;
        }
    },
	mounted(){
	    axios.defaults.headers.common["Authorization"] =
                                     localStorage.getItem("user");
	    axios.get("/api/authenticateUser")
	         .then(response => {
	            this.dto = response.data;
	            this.loaded = true;
	         })
	         .catch(() => {
	            this.loaded = false;
	            this.$router.push('/sign-in');
	         })
	}
});
