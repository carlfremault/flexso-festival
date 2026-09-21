# Flexso Festival Manager

The app is deployed on SAP BTP. Access instructions were sent by email.

## Local development

- `npm install` in project root
- `npm install` in `app/ui` for UI dependencies
- `npx cds watch` to start the server
- Server runs on `http://localhost:4004`
- UI runs on `http://localhost:4004/ui`
- Mocked authentication during development: Alice is an admin, Bob is a user

## Features

### Admin

- Admins can view, create, edit and delete events
- Admins can view, create, edit and delete timeslots for events
- Admins can view, add and remove artists (WIP)

### Users

- Users can view events
- Users can view timeslots for events
- Users can view and add artists (WIP)

## Tech Stack

### Back end

- SAP Cloud Application Programming Model (CAP) on Node.js
- TypeScript
- SQLite database during development, SAP HANA Cloud in production
- XSUAA for authentication (production)
- Deezer REST API for artists data

### Front end

- React
- React Router
- UI5 Web Components for React library
- React Query (Tanstack Query) for remote state management and data fetching
- TypeScript

### On AI use

- I used Claude Code as a senior pair programmer for questions, sparring, and code review.
- All features and application code were written by me. Claude reviewed and challenged it, but never authored it.
- For designing the frontend wireframe I did a back and forth session with Claude. I am not a designer and would have spent a lot of time for a result that would not have been as good.
