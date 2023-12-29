# Strategist CMS

## Overview

Strategist CMS is a content management system designed for simplicity and flexibility. It is divided into two main components: the backend API and the frontend application.

## Backend

### Technologies Used
- Node.js
- TypeScript
- MongoDB
- Express.js
- Monitoring with `prom-client`

### Setup
1. Clone the repository.
2. Navigate to the `backend` directory.
3. Before running, ensure you have [PNPM](https://pnpm.io/) installed globally.
4. Install dependencies with `pnpm install`.
5. Generate keys with `pnpm generate:keys`.
6. Configure your MongoDB connection in the `.env` file.
7. Run the server with `pnpm start`.

## Frontend

### Technologies Used
- Next.js 14

### Features
- Free page builder.
- Rich editor with CMS features.

### Setup
1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Before running, ensure you have [PNPM](https://pnpm.io/) installed globally.
4. Install dependencies with `pnpm install`.
5. Run the application with `pnpm run dev`.

## Contributing

We welcome contributions and feedback. Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) when contributing to ensure a positive and inclusive community.

## Monorepo with Turbo

This project uses [Turbo](https://turbo.build/repo) for monorepo management.

## License

This project is licensed under the [MIT License](./LICENSE).
