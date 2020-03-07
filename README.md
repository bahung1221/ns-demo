## Nativescript demo app
This demo is an Cryptocurrency market arbitrage (BTCUSD) that will get realtime data (price) from many cryptocurrency trading platform through their websocket server and then display in a mobile list view.

**NOTE**: Because `NativeScript PREVIEW (Playground)` cannot support Websockets so we must either do a cloud build or a local build; `Preview` cannot use native "compiled" modules of which NS-Websocket is one of them... In this demo, i used local build on XCode simulator.

### Demo:
<img src="https://github.com/bahung1221/ns-demo/raw/master/src/app/shared/images/demo.gif" width="400" alt="Demo Video">

### Run:
Because we must do `local build` to make this demo work, so we must install [full nativescript system requirements](https://docs.nativescript.org/angular/start/general-requirements#full-setup-requirements) first.

After that, just run this demo on simulator or connected device:

- Install Nativescript cli:
```
npm install -g nativescript
```

- Install dependencies:
```
tns install

npm install
```

- Run app in simulator (through tns cli):
```
tns run ios

# or

tns run android
```

- **If** `tns cli` can't open simulator, we must manual open simulator first and then use `tns run` again, for ios:
```
xcrun simctl list
# get udid of the device you want to launch
# Paste this in the terminal
open -a Simulator --args -CurrentDeviceUDID <DeviceUDID>

# run
tns run ios
```
