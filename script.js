//Vue component for diplaying course list in localstorage.
//Includes search, sorting and filtering
Vue.component('course-list', {
  props: ['topics', 'prices', 'courses'],
  data: function() {
    return {
      search: '',
      selectedTopic: '',
      selectedPrice: '',
      sorting: '',
      sortingType: ''
    }
  },

  template: `
            <div>
              <div style="display:flex;">
                <div class="search-wrapper">
                  <label>Search title</label></br>
                  <input type="text" v-model="search">
                </div>

                <div>
                  <label>Filter</label></br>
                  <select v-model="selectedTopic" placeholder="Topic filter">
                    <option></option>
                    <option v-for="topic in topics">{{topic}}</option>
                  </select>

                  <!--<select v-model="selectedPrice">
                    <option></option>
                    <option v-for="price in prices">{{price}}</option>
                  </select>-->

                </div>

                <div>
                  <label>Sort</label></br>
                  <select v-model="sorting">
                    <option></option>
                    <option>Alphabetically</option>
                    <option>Price</option>
                  </select>

                  <input type="radio" name="type" value="ascending" v-model="sortingType"> Ascending
                  <input type="radio" name="type" value="descending" v-model="sortingType"> Descending

                </div>
              </div>

              <div v-for="course in filteredSortedList">
                {{course}}
              </div>
            </div>`,

  computed: {
    searchList() {
      //this.getCourses();
      return this.courses.filter(course => {
        return course.topic.toLowerCase().includes(this.search.toLowerCase());
      })
    },

    filteredList() {
      return this.searchList.filter(course => {
        return course.topic.toLowerCase().includes(this.selectedTopic.toLowerCase());

      })
    },

    filteredSortedList() {
      if(this.sorting === 'Alphabetically') {
        if(this.sortingType === 'ascending') {
          return this.filteredList.sort((a,b) => (a.topic > b.topic) ? 1 : ((b.topic > a.topic) ? -1 : 0));
        } else if(this.sortingType === 'descending') {
          return this.filteredList.sort((a,b) => (a.topic > b.topic) ? 1 : ((b.topic > a.topic) ? -1 : 0)).reverse();
        } else {
          this.sortingType = 'ascending';
          return this.filteredList.sort((a,b) => (a.topic > b.topic) ? 1 : ((b.topic > a.topic) ? -1 : 0));
        }
      } else if(this.sorting === 'Price') {
        if(this.sortingType === 'ascending') {
          return this.filteredList.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        } else if(this.sortingType === 'descending') {
          return this.filteredList.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)).reverse();
        } else {
          this.sortingType = 'ascending';
          return this.filteredList.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0));
        }
      } else {
        this.sorting = '';
        this.sortingType = '';
        return this.filteredList;
      }
    }
  }

})


//Vue component for displaying courses that have been submited bu currently
//loged in user
Vue.component('my-courses', {
  props: ['logedInUser', 'courses'],

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
            <div v-for="course in myCourses" v-bind:id="course.id">
              {{course}}
              <button @click="deleteCourse(course.id)">Delete</button>
            </div>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                CLOSE
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>`,

  computed: {

    myCourses() {
      return this.courses.filter(course => {
        return course.author.toLowerCase().includes(this.logedInUser.toLowerCase());
      })
    }
  },

  methods: {

    deleteCourse: function(courseId) {
      console.log(courseId);
      for(let course = 0; course < this.courses.length; course++) {
        if(this.courses[course].id === courseId) {
          this.courses.splice(course, 1);
          localStorage.setItem("courses", JSON.stringify(this.courses));
        }
      }
    }
  }
})

//Vue component for adding courses by creator type users
Vue.component('add-course', {
  props: ['logedInUser', 'courses'],
  data: function() {
    return {
      id: 0,
      topic: '',
      description: '',
      price: null,
      county: '',
      postcode: '',
      day: '',
      time: '',
      length: null,
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
      ],
      topics: [
        'Math',
        'Physics',
        'Astrology',
        'Computer Science',
        'Sports',
        'Cooking',
        'Driving'
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
              <select v-model="topic" id="topic" required>
                <option v-for="topic in topics">{{topic}}</option>
              </select> </br>

              <label for="price">Price</label></br>
              <input id="price" v-model.number='price' required></br>

              <label for="counties">Location</label></br>
              <select v-model="county" id="counties" required>
                <option v-for="county in counties">{{county}}</option>
              </select> </br>

              <label for="postcode">Postcode</label></br>
              <input id="postcode" v-model='postcode' required></br>

              <label for="days">Days</label></br>
              <select v-model="day" id="days" required>
                <option v-for="day in days">{{day}}</option>
              </select> </br>

              <label for="time">Time</label></br>
              <input id="time" v-model='time' required></br>

              <label for="length">Length</label></br>
              <input id="length" v-model.number='length' required></br>

              <label for="description">Description</label></br>
              <input type="text" id="description" v-model='description' required></br>

              <button v-on:click="addCourse">ADD COURSE</button>
            </form>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                CLOSE
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>`,

  methods: {

    addCourse: function() {
      if(this.topic !== '' && this.price !== null && this.county !== '' &&
         this.postcode !== '' && this.day !== '' && this.time !== '' &&
         this.length !== null && this.description !== '') {
           this.setId();
           this.courses.push({
             id: this.id,
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
         }
    },

    setId: function() {
      var courseId = 0;
        if(this.courses.length !== 0 && this.courses.length !== 1) {
          for(let course = 1; course < this.courses.length; course++) {
            if(this.courses[course].id >= this.courses[course - 1].id) {
              courseId = this.courses[course].id;
            } else {
              courseId = this.courses[course - 1].id;
            }
          }
          this.id = courseId + 1;
        } else if(this.courses.length === 1){
          courseId = this.courses[0].id;
          this.id = courseId + 1;
        } else {
          this.id = courseId;
        }
    }
  }
})

//Vue component for displaying login form and for changing user's login status
Vue.component('log-in', {
  props: ['users'],
  data: function() {
    return {
      username: "",
      password: ""
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
              <label>Email</label></br>
              <input v-model='username' required> </br>
              <label>Password</label></br>
              <input type="password" v-model='password' required>
              <button v-on:click="logIn">LOG IN</button>
            </form>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">

              <button class="modal-default-button" @click="$emit('close')">
                CLOSE
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>`,

  methods: {

    logIn: function(){
      for(let user = 0; user < this.users.length; user++) {
        if(this.users[user].username == this.username &&
           this.users[user].password == this.password) {
             this.users[user].isSignedIn = true;
             localStorage.setItem("users", JSON.stringify(this.users));
             break;
        }
      }
    }

  }
})


//Vue component that displays sign up form and inserts new user into localStorage
//given the information provided is valid
Vue.component('sign-up', {
  props: ['users'],
  data: function() {
    return {
      usertype: "",
      username: "",
      password: ""
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
              <label>Email</label></br>
              <input v-model='username' required></br>
              <label>Email</label></br>
              <input type="password" v-model='password' required>
              <button v-on:click='addUser'>SIGN UP</button>
            </form>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                CLOSE
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>`,

  methods: {

    addUser: function() {
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
            isSignedIn: false
          });
          localStorage.setItem("users", JSON.stringify(this.users));
          alert("You Have Successfully Registered");
          $emit('close');

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
    showMyCoursesModal: false,
    isLogedIn: false,
    status: {
      logedInUser: '',
      usertype: ''
    },
    users: [],
    courses: [],
    topics: [
      'Math',
      'Physics',
      'Astrology',
      'Computer Science',
      'Sports',
      'Cooking',
      'Driving'
    ],
    prices: [
      '0-50',
      '50-100',
      '>100'
    ]
  },
  methods: {

    loginStatus: function() {
      this.getUsers();
      this.getCourses();
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
    },

    getUsers: function() {
      if(localStorage.getItem("users") == null) {
        this.users = [];

      } else {
        this.users = JSON.parse(localStorage.getItem("users"));
      }
    },

    getCourses: function() {
      if(localStorage.getItem("courses") == null) {
        this.courses = [];

      } else {
        this.courses = JSON.parse(localStorage.getItem("courses"));
      }
    }
  },

  beforeMount(){
    this.loginStatus();
 }
})
