# FreeAPI.app

## Problem

We are trying to build a single source API hub that can be used to learn api handling in any programming language. Users can build their front end portfolio in web and mobile apps using this api hub.

# What is FreeAPI.app

The FreeAPI project is an innovative and community-driven initiative aimed at providing developers with free and accessible APIs for their projects.

The project focuses on delivering a wide range of APIs that cater to various domains and functionalities, enabling developers to seamlessly integrate these APIs into their applications.

Key highlights of the FreeAPI project include:

1. **Accessibility:** The FreeAPI project is committed to eliminating barriers by providing free access to its collection of APIs.
   Developers can leverage these APIs without any cost limitations, allowing them to experiment, learn, and build innovative applications.

2. **Diverse API Collection:** The project offers a diverse and comprehensive collection of APIs that span across different industries, domains, and functionalities.
   Whether you require social media integrations, payment gateways, machine learning algorithms, or IoT device connectivity, the FreeAPI project has you covered.

3. **Simplified Integration:** The FreeAPI project understands the challenges developers face when integrating APIs into their applications. To address this, the project provides clear documentation, code samples, and SDKs, simplifying the integration process and reducing development time and effort.

4. **Community-Driven Development:** The project fosters a vibrant and collaborative community of developers. Contributors are encouraged to share their knowledge, engage in discussions, and collaborate on API-related projects. This collective effort ensures the continuous improvement and reliability of the APIs offered by the FreeAPI project.

5. **Learning and Skill Development:** The FreeAPI project aims to empower developers by providing a platform for learning and skill development. Through access to various APIs and educational resources, developers can enhance their understanding of API integration, expand their knowledge, and showcase their expertise through building complete projects.

Overall, the FreeAPI project is a valuable resource for developers seeking accessible and diverse APIs.

By fostering a supportive community, the project empowers developers to learn, create, and innovate, ultimately contributing to the growth and advancement of the API integration landscape.

## Features:

Introducing our groundbreaking open source API hub project, a dynamic platform designed to revolutionize the way developers interact with APIs.

With an emphasis on openness, accessibility, and learning, our API hub empowers developers of all levels to explore, experiment, and grow their skills in API integration.

Highlights:

1. **Open Source:** Our API hub is built on the principles of open source, ensuring transparency, collaboration, and community-driven development. This means that the source code is freely available, allowing developers to customize, extend, and contribute to the project.

2. **Free to Use:** We firmly believe in removing barriers to entry, which is why our API hub is completely free to use. Whether you're a seasoned developer or just starting your coding journey, you can leverage our platform without any cost limitations.

3. **Local or Deployment**: Flexibility is at the core of our API hub. You have the option to use it locally, running on your own machine, or deploy it to a server, making it accessible to others. This versatility ensures that you can adapt the platform to your specific development environment.

4. **Learning Resource**: Our API hub is designed as a comprehensive learning resource, offering a wealth of educational materials, tutorials, and documentation. Whether you're a beginner or seeking to expand your API knowledge, our platform provides the resources you need to learn and improve.

5. **Custom Endpoints for Beginners**: For developers at the beginner level, our API hub offers custom endpoints that provide a hands-on experience in handling API responses. These beginner-friendly APIs allow you to practice and familiarize yourself with the basics of working with APIs.

6. **Advanced APIs for Portfolio Building**: In addition to beginner-level endpoints, our API hub also provides advanced APIs to challenge and stretch your skills. These APIs enable you to tackle more complex integration scenarios, helping you build a robust portfolio of projects to showcase your expertise.

By combining open source principles, accessibility, and a focus on learning, our API hub project paves the way for developers to thrive in the world of API integration. Join our vibrant community and embark on an exciting journey of discovery, growth, and innovation.

### How to contribute - Guidelines

We welcome your interest in contributing to our open source project!

To contribute to ApiHub, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feat/your-feature-name` or `git checkout -b fix/your-bug-fix-name`.
3. Make your changes and commit them with descriptive messages: `git commit -am 'Add your commit message'`.
4. Push your changes to your forked repository: `git push origin feat/your-feature-name`.
5. Submit a pull request to the main repository, explaining the changes you've made and providing any necessary details.

Here's a guide on how you can effectively contribute to our API hub:

1. Pull Requests for Readme Updates: Please refrain from sending pull requests solely for updating the project's readme file. While we appreciate the importance of clear and concise documentation, we prefer to focus on substantial code contributions and feature enhancements.

2. Grammar Updates: Our team values effective communication, but we're not grammar sticklers. You don't need to send pull requests solely for grammar fixes or minor language improvements. Instead, concentrate on the core functionalities and features of the project.

3. Avoid Updating Existing Public APIs: To maintain stability and consistency, we discourage direct updates to existing public APIs within the API hub. These APIs have been thoroughly tested and approved. However, if you encounter any bugs or issues, we encourage you to open an issue on our project's issue tracker to notify us.

4. Build New Project APIs: We encourage you to explore your creativity and contribute by building complete project APIs. These APIs should provide comprehensive solutions that can assist developers in constructing complex projects to showcase their skills and abilities. Your contributions in this area will greatly benefit the community.

5. Draft a Proposal and Discuss on Discord: Before diving into your project, we recommend drafting a proposal. This can include a mind map or outline of the API you intend to build and its potential benefits. Join our Discord community, where you can share your proposal, discuss ideas, and gather feedback from fellow contributors. Engaging in these discussions will enhance your backend portfolio and help shape the future direction of the project.

We appreciate your enthusiasm and look forward to your valuable contributions to our open source API hub project.

Together, we can foster a collaborative environment and make a significant impact in the API integration landscape.

Click [here](https://github.com/hiteshchoudhary/apihub/blob/dev/CONTRIBUTING.md) for details contribution guide.

## 🏁 Installation

### 📦 Using Docker (recommended)

To run the ApiHub project, follow these steps:

1. Install [Docker](https://www.docker.com/) on your machine.
2. Clone the project repository.
3. Navigate to the project directory.
4. Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
5. Run the Docker Compose command:

```bash
docker-compose up --build
```

6. Access the project APIs at the specified endpoints.

### 💻 Running locally

To run the ApiHub project locally, follow these steps:

1. Install [Yarn](https://yarnpkg.com/), [NodeJs](https://www.nodejs.org/), [MongoDB](https://www.mongodb.com) and [MongoDB Compass (optional)](https://www.mongodb.com/products/compass) on your machine.
2. Clone the project repository.
3. Navigate to the project directory.
4. Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
5. Install the packages:

```bash
yarn install
```

6. Run the project:

```bash
yarn start
```

6. Access the project APIs at the specified endpoints.

# 📜 Swagger Docs

[Swagger Docs](http://localhost:8080/api/v1/docs/): http://localhost:8080/api/v1/docs/
