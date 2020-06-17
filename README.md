[![pipeline status](https://gitlab.com/QX4MX/vidsync-angular/badges/master/pipeline.svg)](https://gitlab.com/QX4MX/vidsync-angular/pipelines)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.3.
## local with node

### install dependencies 
* make sure [node.js](https://nodejs.org/en/download/) is installed and added to path
* `npm install`

### launch on localhost
Make sure Mongodb installed and running -> change mongodb url in (https://gitlab.com/QX4MX/vidsync-angular/blob/master/src/backend/api/dbUrl.ts)
Also change mongodb url in (https://gitlab.com/QX4MX/vidsync-angular/blob/master/src/app/services/baseUrl.ts) to localhost:4000
To Star Frontend Dev Run `ng serve`. 
To Start Backend Dev Run `nodemon` && `tsc --watch`.

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


### build project files
Option1
* Run `ng build --prod` && `tsc`  to build the project. The build artifacts will be stored in the `dist/` directory.
Option2
* `npm run setup` will build frontend with ng-build and backend tsc

Once build
* `npm run launch` will start node server http://localhost:4000/ 

You can also use the specific commands which can be found in [package.json ](https://gitlab.com/QX4MX/vidsync-angular/blob/master/package.json) -> scripts

## local with docker
* make sure docker is installed and added to path 
* `docker-compose up --build` to launch on localhost:4000


## kubernetes with helm
* make sure kubernetes is setup, helm installed und vidchart values set
* `helm install vidchart --val MONGODB_URI=$MY_MONGODB_URI url --val ytApi=$MY_YTAPI_KEY path-vidchart`
or
* `helm install vidchart -f secrets.yaml path-vidchart`


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Live Website
[https://vidsync.de/](url)
