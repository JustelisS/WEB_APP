
const login = new Vue({
  el:'#log',
  data: {
    username: '',
    password: '',
    users: []
  },
  methods: {

    changeStatus: function() {
      this.getUsers();
      if(doesExist().value) {
        this.users.isSignedIn = true;
      } else {
        alert("Invalid Information");
      }
    },

    doesExist: function() {
      for(let user = 0; user < this.users.length; user++) {
        if(this.users[user].username == this.username &&
            this.users[user].password == this.password) {
          return {
                  value: true,
                  position: user
                };

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

const registration = new Vue({
  el:'#reg',
  data: {
    usertype: "",
    username: "",
    password: "",
    users: []
  },


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
