- Open specific ios simulator:
```
xcrun simctl list
# get udid of the device you want to launch
# Paste this in the terminal
open -a Simulator --args -CurrentDeviceUDID <DeviceUDID>
```

### NOTE:
NativeScript PREVIEW cannot support Websockets! You must either do a cloud build or a local build; Preview cannot use native "compiled" modules of which NS-Websocket is one of them...
