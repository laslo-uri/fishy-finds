Vue.component('sign-in', {
	data: function(){
		return{
		    user: {
		        email : "",
		        password : ""
		    },
		    backgroundColor : "#ed1c24",
            cursorStyle : "default"
		}
	},
template: `	
		<div>
            <nav-bar></nav-bar>
            <div class="ff-auth">
                <div class="ff-auth__panel">
                    <img class="ff-auth__mark" src="images/fishy-finds-logo.png" alt="FishyFinds">
                    <h1 class="ff-auth__title">Sign in</h1>
                    <p class="ff-auth__sub">Access stays, charters, and guided fishing days.</p>
                    <form @submit.prevent="signIn">
                        <input type="email" placeholder="Email" class="ff-field" v-model="user.email"/>
                        <input type="password" placeholder="Password" class="ff-field" v-model="user.password"/>
                        <input :disabled="!isComplete" @click="signIn" v-bind:style="{'background-color':backgroundColor, 'cursor':cursorStyle}" class="ff-btn ff-btn--primary" type="button" value="Sign in" />
                    </form>
                </div>
            </div>
		</div>
		`
        ,
        computed : {
            isComplete () {
                flag = /\S/.test(this.user.email) && /\S/.test(this.user.password);
                this.backgroundColor = flag ? "#ed1c24" : "#c9a0a2";
                this.cursorStyle = flag ? "pointer" : "default";
                return flag;
            }
        },
        methods : {
            signIn : function(){
                axios.post('/api/signIn', this.user)
                     .then(response =>{
                           window.localStorage.setItem('user',JSON.stringify(response.data))
                           
                           axios.defaults.headers.common["Authorization"] =localStorage.getItem("user");
                           axios.get("/api/authenticateUser")
                           .then(response => {
                            window.localStorage.setItem('loggedUser',JSON.stringify(response.data));
                            router.push('/')
                           })
                           .catch(() => Swal.fire('Signed in, but profile load failed.', 'Try refreshing.', 'warning'))

                     })
                     .catch(() => Swal.fire('Sign in failed!', 'Check your email and password.', 'error'))
             }
        }
});
