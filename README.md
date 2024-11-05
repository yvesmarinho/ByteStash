# ByteStash
<p align="center">
  <img src="https://raw.githubusercontent.com/jordan-dalby/ByteStash/refs/heads/main/client/public/logo192.png" />
</p>

ByteStash is a self-hosted web application designed to store, organise, and manage your code snippets efficiently. With support for creating, editing, and filtering snippets, ByteStash helps you keep track of your code in one secure place.

![ByteStash App](https://raw.githubusercontent.com/jordan-dalby/ByteStash/refs/heads/main/media/app-image.png)

## Features
- Create and Edit Snippets: Easily add new code snippets or update existing ones with an intuitive interface.
- Filter by Language and Content: Quickly find the right snippet by filtering based on programming language or keywords in the content.
- Secure Storage: All snippets are securely stored in a sqlite database, ensuring your code remains safe and accessible only to you.

## Howto
### Unraid
ByteStash is now on the Unraid App Store! Install it from there.

### Other
ByteStash can also be hosted manually via the docker-compose file:
```
services:
  bytestash:
    image: "ghcr.io/jordan-dalby/bytestash:latest"
    container_name: bytestash
    volumes:
      - /path/to/data:/data/snippets
    ports:
      - 5000:5000
    environment:
      - BASE_PATH=
      # if auth username or password are left blank then authorisation is disabled
      # the username used for logging in
      - AUTH_USERNAME=bytestash
      # the password used for logging in
      - AUTH_PASSWORD=password
      # the jwt secret used by the server, make sure to generate your own secret token to replace this one
      - JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.nhan23TF0qyO4l4rDMkJ8ebNLMgV62NGfBozt9huymA
      # how long the token lasts, examples: "2 days", "10h", "7d", "1m", "60s"
      - TOKEN_EXPIRY=24h
    restart: unless-stopped
```

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Containerisation: Docker

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.
