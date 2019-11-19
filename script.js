Vue.component('todo-item', {
  props: ['task'],
  template: '<li>{{ task.text }}</li>'
})


var app = new Vue({
  el:'#app',
  data: {
    textbox: "",
    todos: []
  },
  methods: {
    addTodo: function() {
      app.todos.push({text: this.textbox})
    }
  }
})


var registration = new Vue({
  el:'#reg',
  data: {
    userType: "",
    username: "",
    password: "",
    users: []
  },
  methods: {

    addUser: function() {
      this.getUsers();
      if(this.username == '' || this.password == '' || this.userType == '') {
        //do nothing

      } else if(this.invalidDetails()){
          alert("Username or Password Too Long");

      } else if(this.doesExist()) {
          alert("User With This Name Already Exists");

      } else {
          this.users.push({
            userType: this.userType,
            username: this.username,
            password: this.password,
            isSignedIn: "false",
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
