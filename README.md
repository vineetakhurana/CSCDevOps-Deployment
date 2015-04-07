###Complete git/hook setup

Create the folder structure
/deploy
  -blue.git
  -blue-www
  -green.git
  -green-ww
  
  green.git and blue.git will have post-receive hooks with the following to fetch code and ensure npm install in target directory:
  
GIT_WORK_TREE=C:/Users/vineetak/Desktop/ncsu\ stuff/Devops/Homework\ 4/deploy/blue-www/ git checkout -f

export GIT_WORK_DIR=C:/Users/vineetak/Desktop/ncsu\ stuff/Devops/Homework\ 4/deploy/blue-www/
cd "$GIT_WORK_DIR"
npm install **
  
