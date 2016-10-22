# Dual N back
## React Native and mobile

This project share (almost) 100% of the logic (redux) between native and web, leaving only specific render implementations to different clients.

### Install
```bash
$ git clone git@github.com:goldylucks/dual-n-back.git
$ cd dual-n-back
$ npm install
$ react-native run-android # for android devices
$ react-native run-ios # for ios device
```

### Develop Web
```bash
$ npm start # starts webpack-dev-server at port 3000
```

### Develop Native
make sure to connect your device or run your emulator first
```bash
$ react-native start
```
