/* global firebase */

'use strict';

// Initialize Firebase
var config = {
apiKey: "AIzaSyANn_1CLa3iR_BzVLPekTQdbqgsNuJRBqQ",
authDomain: "cc89-ba4c8.firebaseapp.com",
databaseURL: "https://cc89-ba4c8.firebaseio.com",
storageBucket: "cc89-ba4c8.appspot.com",
messagingSenderId: "188355216056"
};
firebase.initializeApp(config);
// Initialize the default app

console.log(firebase.app().name);  // "[DEFAULT]"
// Use the shorthand notation to retrieve the default app's services
var defaultStorage = firebase.storage();
var defaultDatabase = firebase.database();

// Get a reference to the database service
var database = firebase.database();
var writingLocation = database.ref('test');
var consumerLocation = database.ref('consumer');

function check_done() {
    // check what company says
  firebase.database().ref('consumer').once('value').then(function(snapshot) {
    var done_val = snapshot.val().sign;
    console.log("beginning... reading consumer", done_val);
    if (done_val == "true") {
      // consumer is done
      console.log("you and company r done l ma o");
      // writeUserData(pVal, "null");
      location.reload();
    } else {
      window.setTimeout(check_done, 1000);
    }
  });
}

var pVal = 2;
// console.log(document.getElementById("add"));
retrieve();
document.getElementById("add").addEventListener("click", function() {
  console.log("adding 1 to ", pVal);
  pVal += 1;
  writeUserData(pVal, "+");
  check_done();
});

document.getElementById("sub").addEventListener("click", function() {
  console.log("subtracting 1 from ", pVal);
  pVal -= 1;
  writeUserData(pVal, "-");
  check_done();
});

/* If retrieve is pressed, firebase will look up value in 'test' once 
* without listening to any actions. the value is stored in result and
* printed in console. */
// document.getElementById("retrieve").addEventListener("click", function() {
//   firebase.database().ref('test').once('value').then(function(snapshot) {
//     var result = snapshot.val().test;
//     console.log("testing retrieve", result);
//   });
// });

function retrieve() {
  firebase.database().ref('test').once('value').then(function(snapshot) {
    var result = snapshot.val().test;
    console.log("testing retrieve", result);
    console.log("type of retrieve", typeof result);
    console.log("testing p", document.getElementById("p").innerHTML);
    pVal = result;
    console.log("new p: " , pVal);
    writingLocation.set({
      test: pVal,
      sign: "null", 
    });
  });
}

/* Write the new pvalue (test) to firebase */
function writeUserData(test, sign) {
  console.log("writing");
  writingLocation.set({
    test: test,
    sign: sign, 
  });
}

if (document.getElementById("p").innerHTML[7] == 'S') {
  document.getElementById("p").innerHTML = 'There has recently been a horrific terrorist attack in the country, and the FBI has found a device owned by the terrorist and produced by your company in its investigation. Unfortunately, the device is locked by a passcode, and neither the FBI nor you can crack the passcode. In fact, the only way to unlock the device would be for your company to develop an in-house decryption algorithm for passcodes on all such devices. The FBI desperately wants you to develop such an algorithm as information on the device could potentially give them great intel on the terrorist organization behind the attack. There is also a lot of political pressure for your company to create the algorithm. However, if this algorithm is stolen by hackers in the future, then all of your customers’ data on your devices risk the chance of being leaked. If you are willing to develop the decryption algorithm to help the FBI with their investigation, please click +. Otherwise, click -.'
;
}


