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

Two redis instances have been created to run on 6379(for blue) and 6380(for green) each.

The -watch and --watchDierctory flags have been set to maonitor any changes made.

###Demonstrate /switch route:

infrastructure.js deals with intercepting /switch request.

It will switch from GREEN to BLUE if target before switch was GREEN and vice-versa.

###Demonstrate migration of data on switch

The queue 'items' is used to store images in the main.js of the app.

In infrastructure.js, on intercepting a /switch request, if the current target was BLUE, the 'items' queue from blue redis instance are captured and copied to a new queue using **lrange**. This list's items are then pushed on the 'items' queue of green redis instance using **rpush**.

Similarly, images are pushed from the 'items' queue of green redis instance to blue if current target was green before switch!

###Demonstrate mirroring

A 'flag' variable is used to check for mirroring.

Depending on the current target, the POST request is handled for both the instances.

The POST request is intercepted and serviced for the current target. Another **proxy.web( req, res, {target: TARGET });** is performed for the other TARGET so that /upload request is also sent for the other target.


  
