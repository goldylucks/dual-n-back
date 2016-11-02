/* eslint no-useless-escape: 0 */

const replace = require('replace')
const path = require('path')
const appDirName = 'dualmobile' // configured initially by react-native init {project name}
const appPackageName = 'com.dualNback'
const appDevPackageName = 'com.dualNbackDev'
const appDisplayName = 'Dual N Back'
// const appDevDisplayName = 'Dual N Back (DEV)'

const isDev = process.argv.indexOf('-p') === -1 && process.argv.indexOf('--prod') === -1

// App name
replace({
  paths: [path.join(__dirname, '..', 'android/app/src/main/res/values/strings.xml')],
  regex: isDev ? '>' + appDisplayName + '<' : />Dual N Back \(DEV\)</, // weird syntax due to bug in replace package
  replacement: isDev ? '>Dual N Back \(DEV\)<' : '>' + appDisplayName + '<', // weird syntax due to bug in replace package
})

// Package name single quotes
replace({
  paths: [path.join(__dirname, '..', 'android/app/BUCK')],
  regex: isDev ? '\'' + appPackageName + '\'' : '\'' + appDevPackageName + '\'',
  replacement: isDev ? '\'' + appDevPackageName + '\'' : '\'' + appPackageName + '\'',
})

// Package name double quotes
replace({
  paths: [
    path.join(__dirname, '..', 'android/app/build.gradle'),
    path.join(__dirname, '..', 'android/app/src/main/AndroidManifest.xml'),
  ],
  regex: isDev ? '"' + appPackageName + '"' : '"' + appDevPackageName + '"',
  replacement: isDev ? '"' + appDevPackageName + '"' : '"' + appPackageName + '"',
})

// Package name no quotes
replace({
  paths: [
    path.join(__dirname, '..', 'android/app/src/main/java/com/' + appDirName + '/MainApplication.java'),
    path.join(__dirname, '..', 'android/app/src/main/java/com/' + appDirName + '/MainActivity.java'),
  ],
  regex: isDev ? appPackageName + ';' : appDevPackageName + ';',
  replacement: isDev ? appDevPackageName + ';' : appPackageName + ';',
})

const version = isDev ? 'DEV' : 'PRODUCTION'
console.log('\ngradelw configured for ' + version)
