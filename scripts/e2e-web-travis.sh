#!/bin/bash
set -e # stop on error

sudo apt-get update
# fire up xvfb on port :99.0
export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start
# set the xvfb screen size to 1280x1024x16
/sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1280x1024x16

npm run start:e2e & sleep 20 && npm run e2e:web