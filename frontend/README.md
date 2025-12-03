# XExit Frontend

A minimal React frontend for the XExit employee resignation management system.

## Features

### Authentication
- User registration and login
- JWT token-based authentication
- Role-based access control (employee/admin)

### Employee Features
- Submit resignation with last working day
- Submit exit interview responses

### Admin Features
- View all resignation requests
- Approve/reject resignations with exit date
- View exit interview responses

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Integration

The frontend connects to the backend API running on `http://localhost:3000` with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /user/resign` - Submit resignation
- `POST /user/responses` - Submit exit responses
- `GET /admin/resignations` - View resignations (admin)
- `PUT /admin/conclude_resignation` - Approve/reject resignation (admin)
- `GET /admin/exit_responses` - View exit responses (admin)

## Usage

1. Register as a new user or login with existing credentials
2. Employees can submit resignations and exit interview responses
3. Admins can manage resignation requests and view exit responses