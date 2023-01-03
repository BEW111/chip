## Contents
- `Chip`: main folder for the iOS app itself
- `chip-backend`: currently unused, was considering migrating to Django but sticking to Firebase for now
- `chip-lab`: data analysis on goal data and habit data

## Running

### iOS
Simulator
- `npx react-native start` to start Metro
- `npx react-native run-ios` to start the simulator (may need to add `--simulator=='iPhone14'`)

Physical Device
- Plug device in via USB
- Open `ChipProject.xcodeworkspace` in XCode
- Press "Build"

## Building for the App Store
- Use the "Archive" option in XCode
