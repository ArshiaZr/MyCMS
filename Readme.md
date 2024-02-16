# MyCMS

MyCMS is a Content Management System (CMS) project designed to provide a flexible and customizable platform for managing web content. This README provides instructions on how to set up and deploy MyCMS using Docker Compose.

## Demo

Below is a demonstration of MyCMS in action:

![MyCMS Demo](demo.gif)

## Features

- **Back-end server**: Node.js based server for managing CMS functionality.
- **Front-end server**: React.js based server for the user interface.
- **Caddy Web Server**: Acts as a reverse proxy and provides HTTPS support.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the MyCMS repository to your local machine.
2. Navigate to the root directory of the project.

## Configuration

Before running the project, you need to set up the environment variables. You can do this by creating a `.env` file in the root directory of the project and adding the following variables:

```
NODE_ENV=development
DB_STRING=<your_database_connection_string>
DB_STRING_PROD=<your_production_database_connection_string>
PORT=<server_port>
SERVER_URL=<server_url>
EMAIL_SERVICE=<email_service_provider>
EMAIL_USERNAME=<email_username>
EMAIL_PASSWORD=<email_password>
```

Replace the placeholders with your actual configurations.

## Docker Compose

The `docker-compose.yml` file provided in the repository orchestrates the deployment of the back-end, front-end, and Caddy web server.

```yaml
version: "3.9"

services:
  # CMS back-end server
  cms_back:
    build: ./cms_back
    environment:
      NODE_ENV: ${NODE_ENV}
      DB_STRING: ${DB_STRING}
      DB_STRING_PROD: ${DB_STRING_PROD}
      PORT: ${PORT}
      SERVER_URL: ${SERVER_URL}
      EMAIL_SERVICE: ${EMAIL_SERVICE}
      EMAIL_USERNAME: ${EMAIL_USERNAME}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
    restart: unless-stopped
    networks:
      - caddy-net

  # CMS front-end server
  cms_front:
    build: ./cms_front
    restart: unless-stopped
    networks:
      - caddy-net

  # Caddy as a webserver
  caddy:
    image: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    networks:
      - caddy-net
    volumes:
      - ./caddy/data/:/data/
      - ./caddy/config/:/config/
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile

networks:
  caddy-net:
```

To start the application, run the following command in the root directory of the project:

```
docker-compose up -d
```

This will build and start the containers defined in the `docker-compose.yml` file in detached mode.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).

---

For more information on how to use MyCMS, please refer to the project documentation.
