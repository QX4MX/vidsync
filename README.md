[![pipeline status](https://gitlab.com/QX4MX/vidsync/badges/master/pipeline.svg)](https://gitlab.com/QX4MX/vidsync/pipelines)

part of this project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.3.



# Development
### node deploy on localhost
* make sure [node.js](https://nodejs.org/en/download/) is installed and added to path
* make sure [Mongodb](https://docs.mongodb.com/manual/installation/) is installed and running
* create an .env file with secrets (MONGODB_URI && ytApi) in the root folder.
```
MONGODB_URI = MY_MONGODB_URI
ytApi= MY_YTAPI_KEY
```
* run `npm install`

* run `ng serve`
* run `tsc -w`
* run `nodemon dist/out-tsc/src/backend/server.js`

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### OR docker-compose up
* make sure docker is installed and added to path
* create an .env file with secrets (MONGODB_URI && ytApi) in the root folder.
* `docker-compose up --build` to launch on localhost:4000

# Production
* Run `ng build --prod` && `tsc`  to build the project. The build artifacts will be stored in the `dist/` directory.
* OR `npm run setup` which does the same.

### Once build
* `npm run launch` will start node server http://localhost:4000/ 

You can also use the specific commands which can be found in [package.json ](https://gitlab.com/QX4MX/vidsync/blob/master/package.json) -> scripts

## deploy on kubernetes with helm
* make sure kubernetes is setup, helm installed und vidchart values set

* `helm install vidchart --val MONGODB_URI=$MY_MONGODB_URI url --val ytApi=$MY_YTAPI_KEY [my-path-vidchart]`
* OR `helm install vidchart -f secrets.yaml [my-path-vidchart]`

which should look something like 
```
apiVersion: v1
kind: Secret
metadata:
  name: vidsync-env-var
type: Opaque
data:
    MONGODB_URI: MY_MONGODB_URI (base64)
    ytApi: MY_YTAPI_KEY (base64)
```

## Running unit tests (Not implemented)
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests (Not implemented)
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).


Live Website
[https://vidsync.de/](url)
