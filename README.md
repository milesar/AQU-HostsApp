[logo]: https://github.com/milesar/AQU-HostsApp/blob/master/resources/logo_aqu.png
[screenshot1]: https://github.com/milesar/AQU-HostsApp/blob/master/resources/Screenshot1.png
[screenshot2]: https://github.com/milesar/AQU-HostsApp/blob/master/resources/Screenshot2.png
[screenshot3]: https://github.com/milesar/AQU-HostsApp/blob/master/resources/Screenshot3.png
![logo]
# Hybrid-Mobile app for AQ&U sensor hosts.

This project is for AQ&U sensor hosts, and provides a cross-platform mobile app for managing their sensors along with easier, more 
direct access to the data they record. It was built with the Ionic v4 beta and Angular (see package.json for all dependencies and other
frameworks / packages used). The project file structure is organized according the the Angular Style Guide. The author was unfamiliar
with all of the technologies involved at the start of the project, so any constructive criticism and suggestions for improvement
are especially welcome.
![screenshot1]
![screenshot2]
![screenshot3


## Getting Started

To run or work on this codebase, you will need the Ionic, Angular, and the Ionic CLI. The rest of the dependencies should be taken
care of when you run the project for the first time.

### Prerequisites

First you will need Node.js and NPM, available here
```
https://nodejs.org/en/
```
Next, install the Ionic CLI, which we will use to launch a test server as well as build iOS and Android binaries.

```
$ npm install -g ionic
```

### Installing
First clone the repo.
```
git clone https://github.com/milesar/AQU-HostsApp.git
```
Next, cd into the main project folder.

```
$ cd AQU-HostsApp
```
Finally, run the following command to build the application for the first time.
```
$ ionic build
```
Once built, you can launch a test server to run the app in a browser 'lab'
```
$ ionic lab -c
```

## Deploying / testing on iOS (with Cordova)

For a detailed walkthrough, see https://beta.ionicframework.com/docs/building/ios

To deploy to iOS, you will need to have Xcode installed.

To test on iOS simulators, you will need to download an additional package:
``` 
$ npm install -g ios-sim
```
Once installed, simply run the following command to test:
```
$ ionic cordova run ios -l
```
Finally, to production build can be created with the following command:
```
$ ionic cordova build ios --prod
```
## Deploying / Testing with Android (on Cordova)
For details, see 
https://beta.ionicframework.com/docs/building/android

To test on android, run the following for a long-running CLI process that boots up a live-reload server:
``` 
$  ionic cordova run android -l
```
To build for android using Cordova, run the following:
```
$ ionic cordova build android --prod --release
```

## Working with Capacitor
Ionic v4 now supports capacitor, details for which can be found here:
```
https://capacitor.ionicframework.com/docs/basics/building-your-app/
```
As this integration was still in beta over the course of this project, I deferred to Cordova, but will be migrating the project to capacitor as I gain a little more experience with it.

## Running the tests

This repo uses the Jasmine and Karma frameworks for unit testing, but at present these have not been setup. Check back in a few weeks!

## Built With

* [Ionic](https://beta.ionicframework.com/docs/) - Hybrid-mobile app development framework.
* [Angular](https://maven.apache.org/) - Dependency Management
* [angular-chart.js](https://jtblin.github.io/angular-chart.js/) - All line charts.
* [rxjs](https://rxjs-dev.firebaseapp.com/) - The rxjs project.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

Adam Miles

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
Project ideation and conceptualization
* Pascal Goffin, AQ&U project
* Ross Whitaker, AQ&U project

Component Technology Support
* The documentation for all of the technologies involved, and all the hard word that went into them. Would never have been able to pick them up and run without them.

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

License
This project is licensed under the MIT License - see the LICENSE.md file for details
