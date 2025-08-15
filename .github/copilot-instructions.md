# Copilot Instructions for hello-world-git

## Project Overview
This is a Node.js backend prototype with modular service and controller layers. It uses Express (implied by routes/controllers structure), Firebase (see `config/firebaseConfig.js`), and QR code generation (`services/qrCodeService.js`).

## Architecture & Key Components
- **Controllers (`controllers/`)**: Handle HTTP requests, business logic, and interact with services. Example: `authController.js`, `adminController.js`.
- **Services (`services/`)**: Encapsulate reusable logic (e.g., authentication, QR code generation, event handling). Services are stateless and imported by controllers.
- **Routes (`routes/`)**: Define Express route handlers, mapping endpoints to controllers. Example: `authRoutes.js`, `adminRoutes.js`.
- **Middlewares (`middlewares/`)**: Custom Express middleware for authentication and admin checks.
- **Config (`config/`)**: Centralized configuration, including Firebase setup and validation logic.
- **Views (`views/`)**: EJS templates for server-side rendering.
- **Public (`public/`)**: Static assets (CSS, JS).
- **Uploads (`uploads/`)**: Stores uploaded files, referenced by hash.

## Developer Workflows
- **Start Server**: Run `node server.js` from project root.
- **No build step**: Directly run with Node.js; no transpilation required.
- **Testing**: No test framework detected; add tests in a `tests/` folder if needed.
- **Debugging**: Use VS Code or Node.js debugger; entry point is `server.js`.

## Patterns & Conventions
- **Service Pattern**: All business logic is in `services/`, controllers only orchestrate.
- **Hash/QR Generation**: See `services/qrCodeService.js` for custom hash and QR code logic.
- **Validation**: Centralized in `config/validations.js`.
- **Authentication**: Firebase-based, see `config/firebaseConfig.js` and `services/authService.js`.
- **Uploads**: Files are stored in `uploads/` with hash-based filenames.
- **EJS Views**: Use partials for reusable UI components.

## External Integrations
- **Firebase**: Used for authentication and possibly data storage.
- **QRCode**: Used for generating QR codes from hashes.

## Example: QR Code Service
- `generateQrCode()` in `services/qrCodeService.js` returns a `{ hash, qrCodeDataUrl }` object for use in controllers/routes.

## How to Extend
- Add new endpoints: Create a controller, service, and route file. Register the route in `server.js`.
- Add new middleware: Place in `middlewares/`, import in routes as needed.

## References
- Entry point: `server.js`
- Example service: `services/qrCodeService.js`
- Example controller: `controllers/authController.js`
- Example route: `routes/authRoutes.js`

---
Update this file if you add new workflows, conventions, or integrations.
