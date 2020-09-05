# Mercier Vanderlinden Translations

###### This assignment was commissioned by Mercier Vanderlinden's recruitment procedure. The problem statement can be found in the root directory of this repository. Furthermore, the project had to be expanded in a way to show off your creativity and skill.


###### The assignment consists out of 2 projects, which are currently (as of 4 Sep 2020) both deployed. Both the backend and frontend are served over HTTPS using a [Let's Encrypt!](https://letsencrypt.org/) certificate.
* The frontend can be found at https://mercier.xanderapp.com.
* The backend can be found at https://mercierapi.xanderapp.com.

### Importand notice about updates
> The frontend is a Progressive Web App, which installs a Service Worker in the background. When new updates are pushed to production, it can take some time before the Service Worker gets updated. This is why you should clear your browser cache or visit the site in [Incognito Mode](https://support.google.com/chrome/answer/95464?co=GENIE.Platform%3DDesktop&hl=en) when you know there are updates available and do not wish to wait before receiving them.


### Features
- [x] Translate text to any of 140 languages.
- [x] Write your text manually or upload/drop a text file.
- [x] **Install the application on your smartphone** like a native app from the App Store!
- [x] **Chat with native speakers** if you have questions about a certain translation.
- [x] Easely copy your translated text using a handy button.
- [x] Language source and target options are remembered for your next visit.
- [ ] Save a translation to use in offline mode when there is no internet connection available. (_WIP_)

### Used Technologies
##### Frontend
  * [VueJS](https://vuejs.org/)
  * [Vuetify](https://vuetifyjs.com/en/)
  * [Progressive Web App](https://web.dev/progressive-web-apps/)
  * [Socket.io](https://socket.io/)
  * [Docker](https://www.docker.com/)
#### Backend
  * [NodeJS](https://nodejs.org/en/)
  * [Express](https://expressjs.com/)
  * [Socket.io](https://socket.io/)
  * [Docker](https://www.docker.com/)
  * [Nginx](https://www.nginx.com/)

### Install this application as an app
#### On Deskop
![Desktop](https://i.imgur.com/JO6c33Y.png)
#### On Mobile
![Mobile](https://i.imgur.com/r9nIols.png)
