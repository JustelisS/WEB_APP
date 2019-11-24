Vue.component('log-in', {
  data: function() {
    return {
      username: "",
      password: "",
      users: []
    }
  },
  template: `<transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            <form>
              <input v-model='username' required>
              <input type="password" v-model='password' required>
              <button v-on:click="logIn">LOG IN</button>
            </form>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>`,

  methods: {

    logIn: function(){
      this.getUsers();
      for(let user = 0; user < this.users.length; user++) {
        if(this.users[user].username == this.username &&
           this.users[user].password == this.password) {
             this.users[user].isSignedIn = true;
             localStorage.setItem("users", JSON.stringify(this.users));
             break;
        }
      }
    },

    getUsers: function() {
      if(localStorage.getItem("users") == null) {
        this.users = [];

      } else {
        this.users = JSON.parse(localStorage.getItem("users"));
      }
    }

  }
})


// register modal component
Vue.component('sign-up', {
  data: function() {
    return {
      usertype: "",
      username: "",
      password: "",
      users: []
    }
  },
  template: `<transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            <form>
              <input type="radio" name="type" value="user" v-model="usertype" required> User <br>
              <input type="radio" name="type" value="creator" v-model="usertype" required> Creator <br>
              <input v-model='username' required>
              <input type="password" v-model='password' required>
              <button v-on:click='addUser'>SIGN UP</button>
            </form>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>`,

  methods: {

    addUser: function() {
      this.getUsers();
      if(this.username == '' || this.password == '' || this.usertype == '') {
        //do nothing

      } else if(this.invalidDetails()){
          alert("Username or Password Too Long");

      } else if(this.doesExist()) {
          alert("User With This Name Already Exists");

      } else {
          this.users.push({
            usertype: this.usertype,
            username: this.username,
            password: this.password,
            isSignedIn: false,
          });
          localStorage.setItem("users", JSON.stringify(this.users));
          alert("You Have Successfully Registered");
          $emit('close');

      }
    },

    getUsers: function() {
      if(localStorage.getItem("users") == null) {
        this.users = [];

      } else {
        this.users = JSON.parse(localStorage.getItem("users"));
      }
    },

    doesExist: function() {
      for(let user = 0; user < this.users.length; user++) {
        if(this.users[user].username == this.username) {
          return true;

        } else {
          return false;
        }
      }
    },

    invalidDetails: function() {
      if(this.username.length <= 15 && this.password.length <= 25) {
        return false;

      } else {
        return true;
      }
    }
  }
})

// start app
const app = new Vue({
  el: '#app',
  data: {
    showRegModal: false,
    showLogModal: false,
    showAddCourseModal: false,
    isLogedIn: false,
    logedInUser: '',
    users: []
  },
  methods: {

    loginStatus: function() {
      this.getUsers();
      for(let user = 0; user < this.users.length; user++) {
        if(this.users[user].isSignedIn) {
          console.log('got it');
          this.isLogedIn = true;
          this.logedInUser = this.users[user].username;
          return true;
          break;
        } else {
          this.isLogedIn = false;
          this.logedInUser = '';
          return false;
        }
      }
    },

    getUsers: function() {
      if(localStorage.getItem("users") == null) {
        this.users = [];

      } else {
        this.users = JSON.parse(localStorage.getItem("users"));
      }
    },

    logout: function() {
      for(let user = 0; user < this.users.length; user++) {
        this.users[user].isSignedIn = false;
        localStorage.setItem("users", JSON.stringify(this.users));
      }
      this.isLogedIn = false;
    }
  },

  beforeMount(){
    this.loginStatus();
 }
})
