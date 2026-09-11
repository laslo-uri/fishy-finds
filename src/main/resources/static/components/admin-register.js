Vue.component('admin-register', {
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
            registrationTitle: "Administrator Registration",
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
                    <p>Create a new FishyFinds administrator account.</p>
                </div>
                <div class="ff-role-grid">
                    <button type="button" class="ff-role-card" @click="registerAdmin">
                        <img src="images/register-admin.png" alt="">
                        <strong>New administrator</strong>
                        <span>Register another system admin</span>
                    </button>
                </div>
                <div class="ff-detail" style="margin-top:1.5rem;">
                    <h3 class="ff-detail__title">{{ registrationTitle }}</h3>
                    <div class="ff-form-grid">
                        <input type="text" placeholder="First name" class="ff-field" v-model="dto.firstName"/>
                        <input type="text" placeholder="Last name" class="ff-field" v-model="dto.lastName"/>
                        <input type="text" placeholder="Address" class="ff-field" v-model="dto.address"/>
                        <input type="text" placeholder="City" class="ff-field" v-model="dto.city"/>
                        <input type="text" placeholder="Country" class="ff-field" v-model="dto.country"/>
                        <input type="text" placeholder="Phone number" class="ff-field" v-model="dto.phoneNumber"/>
                        <input type="email" placeholder="E-mail" class="ff-field" v-model="dto.email"/>
                        <input type="password" placeholder="Password" class="ff-field" v-model="dto.password"/>
                        <input type="password" placeholder="Confirm password" class="ff-field" v-model="confirmPassword"/>
                        <textarea v-show="showForm == 2 || showForm == 3" rows="4" placeholder="Reasoning" class="ff-field ff-field--wide" v-model="dto.reasoning"></textarea>
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
        		    /\S/.test(this.dto.email) &&
        		    /\S/.test(this.dto.password) &&
        		    /\S/.test(this.confirmPassword);

        		    this.backgroundColor = flag ? "#ed1c24" : "#c9a0a2";
        		    this.cursorStyle = flag ? "pointer" : "default";
        		    return flag;
        		  }
	},
    methods: {
        registerUser : function(){
            if(this.confirmPassword == this.dto.password){
                Swal.fire({

                    title:'Are you sure?',
                    text: "By confirming this, you will create a new admin user.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ed1c24',
                    cancelButtonColor: '#1a1a1a',
                    confirmButtonText: 'Confirm'

                })
                .then((result)=>{

                    if(result.isConfirmed){

                        axios.post('/api/registerUser', this.dto)
                                        	 .then(response => {

                                        	    if(response.data){

                                        	        Swal.fire('Successfully created a new admin user!',
                                                                '',
                                                             'success')

                                        	    }

                                        	 })

                    }

                })

            }
            else{
                console.log("Invalid password")
            }
        },
        registerAdmin : function(){
            this.dto.userType = "ADMIN";
            this.registrationTitle = "Administrator Registration";
        }
    }
});
