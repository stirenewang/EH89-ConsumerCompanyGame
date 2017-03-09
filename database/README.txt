README
how to run: 
--------------------------------------------

1) Navigate into EH89-ConsumerCompanyGame\intro
2) Install the Firebase Command Line Interface (CLI)
	- Serve the web app locally and deploy your web app to Firebase hosting
	- Install npm:
		npm -g install firebase-tools
	- verify CLI is installed correctly. Open a console and run. Make sure the Firebase version is above 3.3.0:
		firebase version 
	- Authorize the Firebase CLI by running:
		firebase login
	- Make sure you are in "intro" directory. set up firebase CLI and use Firebase Project
		firebase use --add
	- select your project ID and follow instructions. (don't overwrite index.html)
3) Run the starter app. Open console:
	firebase serve

	the command should display "Listening at http://localhost:5000"
	Project directory should be "...\GitHub\EH89-ConsumerCompany\Intro"
	Public Directory should be "public"
	
The code: 

accesses the cc89 firebase database and looks for the "test" entry. The test entry contains the pVal. There is a local pval in "company" file that will increment and decrement pVal. When a change is made to pVal, the new value will be written into the "test entry". --> function is "writeUserData"

 If retrieve is pressed, firebase will look up value in 'test' once 
without listening to any actions. the value is stored in result and
printed in console.
