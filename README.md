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
  
###Create blue/green infrastructure

The infrastructure.js has set PORT 5060 for green-www's main.js to be executed. Also, PORT 9090 is dedicated for the blue instance to run.
Two redis instances have been created to run on 6379 and 6380 each.
  
  
