Vue.component('course-list', {
  data: function() {
    return {
      search: '',
      courses: []
    }
  },

  template: `

            <div>
              <div class="search-wrapper">
                <input type="text" v-model="search" placeholder="Search title.."/>
                <label>Search title:</label>
              </div>

              <div v-for="course in filteredList">
                {{course}}
              </div>
            </div>`,

  computed: {
    filteredList() {
      this.getCourses();
      return this.courses.filter(course => {
        return course.topic.toLowerCase().includes(this.search.toLowerCase());
      })
    }
  },

  methods: {

    getCourses: function() {
      if(localStorage.getItem("courses") == null) {
        this.courses = [];

      } else {
        this.courses = JSON.parse(localStorage.getItem("courses"));
      }
    }
  }

})

Vue.component('add-course', {
  props: ['logedInUser'],
  data: function() {
    return {
      courses: [],
      topic: '',
      description: '',
      price: null,
      county: '',
      postcode: '',
      day: '',
      time: '',
      length: 0,
      counties: ['hendon',
                 'colindale',
                 'barnet'],
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ]
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
              <label for="topic">Topic</label></br>
              <input id="topic" v-model='topic' required></br>
              <label for="price">Price</label></br>
              <input id="price" v-model.number='price' required></br>
              <label for="location">Location</label></br>
              <input id="location" type="text" v-model="county" list="counties"></br>
              <datalist id="counties">
                <option v-for="county in counties">{{county}}</option>
              </datalist>
              <label for="postcode">Postcode</label></br>
              <input id="postcode" v-model='postcode' required></br>
              <label for="day">Days</label></br>
              <input id="day" type="text" v-model="day" list="days"></br>
              <datalist id="days">
                <option v-for="day in days">{{day}}</option>
              </datalist>
              <label for="time">Time</label></br>
              <input id="time" v-model='time' required></br>
              <label for="length">Length</label></br>
              <input id="length" v-model.number='length' required></br>
              <label for="description">Description</label></br>
              <input type="text" id="description" v-model='description'></br>
              <button v-on:click="addCourse">ADD COURSE</button>
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

    addCourse: function() {
      this.getCourses();
      this.courses.push({
        topic: this.topic,
        price: this.price,
        county: this.county,
        postcode: this.postcode,
        day: this.day,
        time: this.time,
        length: this.length,
        description: this.description,
        author: this.logedInUser
      });
      localStorage.setItem("courses", JSON.stringify(this.courses));
    },

    getCourses: function() {
      if(localStorage.getItem("courses") == null) {
        this.courses = [];

      } else {
        this.courses = JSON.parse(localStorage.getItem("courses"));
      }
    }

  }


})

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
    status: {
      logedInUser: '',
      usertype: ''
    },
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
          this.usertype = this.users[user].usertype;
          break;
        } else {
          this.isLogedIn = false;
          this.logedInUser = '';
          this.usertype = '';
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
      this.logedInUser = '';
      this.usertype = '';
    }
  },

  beforeMount(){
    this.loginStatus();
 }
})
