Vue.component('course-list', {
  props: ['topics', 'prices'],
  data: function() {
    return {
      search: '',
      courses: [],
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
      this.getCourses();
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

Vue.component('my-courses', {
  props: ['logedInUser'],
  data: function() {
    return {
      courses: []
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
            <div v-for="course in myCourses">
              {{course}}
              <button @click="$emit('close')">Delete</button>
            </div>
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

  computed: {
    myCourses() {
      this.getCourses();
      return this.courses.filter(course => {
        return course.author.toLowerCase().includes(this.logedInUser.toLowerCase());
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
    },

    deleteCourse: function() {
      for(let user = 0; user < this.users.lenght; user++) {

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
              <select v-model="topic" id="topic">
                <option v-for="topic in topics">{{topic}}</option>
              </select> </br>

              <label for="price">Price</label></br>
              <input id="price" v-model.number='price' required></br>

              <label for="counties">Location</label></br>
              <select v-model="county" id="counties">
                <option v-for="county in counties">{{county}}</option>
              </select> </br>

              <label for="postcode">Postcode</label></br>
              <input id="postcode" v-model='postcode' required></br>

              <label for="days">Days</label></br>
              <select v-model="day" id="days">
                <option v-for="day in days">{{day}}</option>
              </select> </br>

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
    showMyCoursesModal: false,
    isLogedIn: false,
    status: {
      logedInUser: '',
      usertype: ''
    },
    users: [],
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
