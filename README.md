# ByteStash
ByteStash is a self-hosted web application designed to store, organise, and manage your code snippets efficiently. With support for creating, editing, and filtering snippets, ByteStash helps you keep track of your code in one secure place.

![ByteStash App](https://raw.githubusercontent.com/jordan-dalby/ByteStash/refs/heads/main/media/app-image.png)

## Features
- Create and Edit Snippets: Easily add new code snippets or update existing ones with an intuitive interface.
- Filter by Language and Content: Quickly find the right snippet by filtering based on programming language or keywords in the content.
- Secure Storage: All snippets are securely stored in a sqlite database, ensuring your code remains safe and accessible only to you.

## Howto
### Unraid
ByteStash comes with an Unraid compatible template for easy deployment
- Copy my-bytestash.xml to `/boot/config/plugins/dockerMan/templates-user/my-bytestash.xml`
- Navigate to the Docker tab in the Unraid UI
- Select "Add Container"
- Select ByteStash from the template list
- Configure as needed

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
    restart: unless-stopped
```

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Containerisation: Docker

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.