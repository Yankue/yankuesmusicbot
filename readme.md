# How to Setup

### 1. Clone the bot to the server/PC with Git.

### 2. Customise Config.JSON
  Pick any prefix you like. The default is comma. Insert you Discord Token to the TOKEN field. Do the same with your youtube api key. To get a youtube api key:  
  A) go to console.developers.google.com/  
  B) Create a project, and in the top left, next to the google logo, select your new project.  
  C) On the left, go on the dashboard tab. Click "Enable APIs and Services"  
  D) Find the "YouTube Data API v3" and enable it  
  E) Go back to the dashboard, and on the left select "Credentials"  
  F) Click create credentials at the top, pick API key, then click edit on the right  
  G) Name it whatever you like. Under "API Restrictions", check "Restrict key", and tick the YouTube API v3 on the dropdown and only the YouTube API v3.  
  H) Copy the API key and paste it in config.json  
  All the other options in config.json can be left as they are.  
  
### 3. Install Dependancies
  All the dependancies are safe and virus free. In your command prompt, navigate to the project, and run the following command: `npm i`
### 4. Test the Bot
  Add the bot to a server, and in your command prompt, run "node ." to start up the bot. It should come online.
  
# How to Integrate to an existing Bot
Main.js isn't important, use your own command handler. However, /include/ and /util/ are important. Copy these folders and their contents into your bot's root directory. All the commands can be copied into your command foler, and if you need to make any changes to your command handler to make it fire the execute function, do it.
  
# How to Use after Setup

### Command List
This is the basic command list. A lot of these commands have aliases.

,play [song] - Add a song to the queue
,search [song] - Show the top 10 results for the song you searched for, and allows you to pick which one to add to queue.
,pause - Pause the music
,resume - If paused, resume the music
,playlist [url] - Add all the music from a YouTube playlist to the queue
,stop - Clear the queue and leave the channel
,skip - Skip to the next song
,queue - View all items on the queue
,skipto [index] - Skip all the songs between the now playing song and the target song. Get a song's index with ,queue
,remove [index] - Remove a song from the queue
,lyrics - See the lyrics for the currently playing songs
,shuffle - Shuffle everything currently in the queue
,loop - Toggle whether to repeat the queue when complete
,np - Show information about the currently playing song

# Support
If you need help, please open an issue and I will help you as best as I can
