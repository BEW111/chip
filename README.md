## Running

Frontend:
- Simulator
- Physical device: plug device in via USB, open `ChipProject.xcodeworkspace` in XCode and build

Backend:
- Configure sharing options: go to Settings > Sharing
  - Change computer name to `name`
  - Allow `name.local` in `ALLOWED_HOSTS` for `settings.py`
  - In `Info.plist`, change `bew.local` to `name.local`
  - Uncheck and check Internet Sharing, check all iPhone USB options, and select the option to share your connection from
- `python manage.py runserver 0.0.0.0:8000` and allow incoming connections for Python
