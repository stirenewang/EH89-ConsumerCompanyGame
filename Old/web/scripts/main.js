
/* global firebase */
'use strict';

// Get a reference to the database service
function test() {
  // Initialize Firebase: TEST
  var config = {
    apiKey: "AIzaSyBLkxzf8ha_ejJOZ3NE5fS9ANLYjPeDggY",
    authDomain: "test-3a926.firebaseapp.com",
    databaseURL: "https://test-3a926.firebaseio.com",
    storageBucket: "test-3a926.appspot.com",
    messagingSenderId: "304893658932"
  };
  firebase.initializeApp(config);
  
  var p = 36;
  var addButton = document.getElementById('add');
  var subtractButton = document.getElementById('subtract');
  console.log(hello);
  var database = firebase.database();
  var dataRef = database.ref('data');
  var p_html = document.getElementById('p');

  //console.log(3)
  addButton.addEventListener('click', function(event) {
    //p.innerHTML += 5;
    p = p+1;
    console.log(p)
    //console.log(p.innerHTML)
    dataRef.push({
        pVal: p
    });
  });

};

window.onload = function() {
  window.test = new test();
};