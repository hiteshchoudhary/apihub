# 🧊 ApiHub

ApiHub is an open-source project aimed at helping developers quickly get up and running with a backend by running a single Docker Compose command.

It provides a collection of backend APIs covering various domains, along with essential concepts and full-blown applications.

It empowers developers to consume these APIs, enabling them to build projects that enhance their API handling skills and facilitate their growth as software developers.

By utilizing these APIs, developers can gain hands-on experience in working with APIs, honing their skills, and gaining a deeper understanding of API integration and usage.

[Jump to the setup](#installation)

## 🧰 Usage

This project is designed to simplify backend development and provide a wide range of APIs for different use cases. Here are the key sections of the project:

### 📢 Public APIs

The **Public APIs** section provides a collection of APIs that offer random data generation for users, books, meals, dogs, cats, jokes, quotes, and more.

Developers can leverage these APIs to integrate dynamic content into their applications.

### 🚰 Kitchen Sink

The **Kitchen Sink** section covers essential concepts and functionalities necessary for backend development.

It includes APIs for HTTP request methods, status codes, cookies, redirects, image responses, request and response inspections, and more. We will continue to add more concepts and functionalities over time.

### 🏟️ Full-Blown Apps

The **Full-Blown Apps** section features major application APIs, including Todo list, ecommerce, social media, and authentication.

These APIs provide a starting point for building robust applications in their respective domains. We have plans to add more full-blown applications in the future.

## 🏁 Installation

To run the ApiHub project, follow these steps:

1. Install [Docker](https://www.docker.com/) on your machine.
2. Clone the project repository.
3. Navigate to the project directory.
4. Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
5. Run the Docker Compose command:

```bash
docker-compose up --build
```

5. Access the project APIs at the specified endpoints.

Boom 💥, no need to install NodeJs, MongoDB separately.

# 📜 Swagger Docs

[Swagger Docs](http://localhost:8080/api/v1/docs/): http://localhost:8080/api/v1/docs/

## 👏🏼 Contributing

We welcome contributions from the software community. To contribute to ApiHub, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feat/your-feature-name` or `git checkout -b fix/your-bug-fix-name`.
3. Make your changes and commit them with descriptive messages: `git commit -am 'Add your commit message'`.
4. Push your changes to your forked repository: `git push origin feature/your-feature-name`.
5. Submit a pull request to the main repository, explaining the changes you've made and providing any necessary details.

Please adhere to the following industry standards and best practices when contributing:

- Follow the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model for your feature branches.
- Write clean and concise code that adheres to the project's coding conventions and style guidelines.
- Provide detailed documentation and updates to the relevant sections if necessary.
- Be respectful and professional in all interactions and discussions.

We appreciate your contributions and look forward to collaborating with you!

## 🔩 Stack Used

- [Docker](https://www.docker.com/)
- [Express.js](https://expressjs.com/)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/)
- [Nodemon](https://nodemon.io/)
- [Faker.js](https://github.com/faker-js/faker)
- [Multer](https://github.com/expressjs/multer)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)

## 🚀 Future Development

ApiHub is an ongoing project, and we have plans to continuously enhance it by adding more applications 🚀, APIs 🛠️, and kitchen sink 🚰 concepts. Stay tuned for updates 👀!
