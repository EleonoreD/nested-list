# Simple Nested List App

## Introduction
Implementation of a simple hierchical list application in React JS for client side & Express Node JS for server side.

The front application allows users to create or edit items and add it to a parent items.
You also can move items from a list to an another by dragging it inside dropzones located at the end of each sub-lists.

The number of nested list levels is unlimited but is fixed by default to 3 for our exemple. 
You can edit `maxLevel` parameter in the App component's state (`src/client/component`).


The backend Express Node JS server starts a RESTful API to get items list, create new item, retreive, edit or delete them.
By default the API is reacheable at the URL : `http://localhost:4000/list/:itemId`


All the source code is written in JS ES6 (in `src` folder) and bundle with Webpack (in the `dist` folder).
The project was build on the boilerplate [create React App](https://github.com/facebook/create-react-app).

## Requirements
- NodeJS v10.* 
- Tested on MacOs & Win10

## Installation & use

```bash
# Install all npm packages
npm install
npm i -g pm2 # Used to keep alive the app

# To run the app on --> http://localhost:4000
npm run start

# To stop the app
npm run stop
```

## Developpement

The app uses Webpack watch feature to check on updates of the source code. 
For each client's side updates, Webpack will bundle the scss, media and source code in the `dist` folder.
Same behavior for server's side updates but Webpack also restart the server at each updates using PM2.

```bash
# To watch the app on developpment mode --> http://localhost:4000
npm run dev
```
