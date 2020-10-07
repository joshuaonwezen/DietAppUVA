## Installation

**Use `node server/app.js` to locally start the application backend**
 - Live version of the backend on cloudno.de and is updated in a different repository (inside the `/7416...` folder in `/server`)
 - Local version can be queried on http://localhost:15416/search?value=pizza after running `node server/app.js`
 - Test on local server using above command & only update live version when everything is correctly working

**Use `npm start` in `frontend` folder to start the frontend**
 - To change to local backend for testing change the searchRecipe fetch function to point to localhost instead of cloudnode
 - Runs on React, to add new components create a seperate file in `/components` and copy the structure of `Recipe.js`