###Complete git/hook setup

Create the folder structure
/deploy

-blue.git

-blue-www

-green.git

-green-ww
  
  green.git and blue.git will have post-receive hooks with the following to fetch code and ensure npm install in target directory:
  
  *GIT_WORK_TREE=$ROOT/deploy/blue-www/ git checkout -f*
  
  *export GIT_WORK_DIR=$ROOT/deploy/blue-www/*
  
  *cd "$GIT_WORK_DIR"*
  
  *npm install*
  
  Similarly for green.git
  
###Create blue/green infrastructure:

The infrastructure.js has set PORT 5060 for green-www's main.js i.e. green instance of the app to be executed. Also, PORT 9090 is set for the blue instance to run. Target has been set to BLUE.

Two redis instances have been created to run on 6379 and 6380 each.

The -watch and --watchDierctory flags have been set to maonitor any changes made.

###Demonstrate /switch route:

infrastructure.js deals with intercepting /switch request.

It will switch from GREEN to BLUE if target before switch was GREEN and vice-versa.





  
