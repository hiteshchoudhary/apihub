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

# ⚠️ Important Note: Avoiding Data Loss and Self-Hosting

# Background:

Our open-source project is currently hosted on a remote server, where we are forced to reset the entire server, **including the file system and MongoDB database**, every **2 hours** to avoid incurring additional costs.

This process results in the **deletion of all image/static files and a reset of the entire database on the server.**

## What does this mean for you?

**Data Loss:**
Any changes made during the 2-hour interval (on the remote server), including uploaded images and user data, will be lost and unrecoverable.

**Service Interruption:**
The server reset might disrupt your development and testing processes for a certain duration while the server is rebooting (for 1-2 minutes).

## Recommended Solutions:

**Local API Usage:**
For development and testing purposes, we strongly recommend using the API locally on your machine by **cloning the project**.

This ensures that your work is not affected by the server resets and allows you to maintain a stable development environment on your local machine.

**Self-Hosting on Railway _(recommended for personal projects)_:**
To self-host the FreeAPI.app application, you can take advantage of a pre-built template that is readily available.
[Click here for detailed docs](https://github.com/hiteshchoudhary/apihub/#-using-railway-one-click-deploy)

# 🏁 Installation

### 📦 Using Docker (recommended)

To run the FreeAPI project, follow these steps:

1. Install [Docker](https://www.docker.com/) on your machine.
2. Clone the project repository.
3. Navigate to the project directory.
4. Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
5. Run the Docker Compose command:

```bash
docker-compose up --build --attach backend

# --build: Rebuild the image and run the containers
# --attach: only show logs of Node app container and not mongodb
```

6. Access the project APIs at the specified endpoints.

### 💻 Running locally

To run the FreeAPI project locally, follow these steps:

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

7. Access the project APIs at the specified endpoints.

### 🚄 Using Railway (One-click Deploy)

To self-host the FreeAPI.app application, you can take advantage of a pre-built template that is readily available.

[![Deploy FreeAPI.app](https://railway.app/button.svg)](https://railway.app/template/B2f7Hq)

1. Click the button above to visit railway.app.

2. Click on the **Deploy Now** button.

3. (Optional) Sign in with GitHub to deploy.

4. Fill in the Repository details:

   - Specify the repo name (e.g., freeapi-app).
   - Checkmark for Public/Private repository.

5. For Environment variables, we have provided some default values in the `ENV` to reduce the burden, but some parameters are mandatory:

   - `PORT`: Do not change the value, let it be set to 8080 to view the swagger docs after deployment.
   - `MONGODB_URI`: Provide the MongoDB Atlas database URL. An example is prefilled for you, edit/update it to continue.
   - `NODE_ENV`: Default set to 'development' to view the logs. You may choose to change it to 'production' (make sure to add exact same word) to hide them.
   - `EXPRESS_SESSION_SECRET`: It is advised to change the default value to your own secret value.
   - `ACCESS_TOKEN_SECRET`: It is advised to change the default value to your own secret value.
   - `ACCESS_TOKEN_EXPIRY`: Set to 1 day as default.
   - `REFRESH_TOKEN_SECRET`: It is advised to change the default value to your own secret value.
   - `REFRESH_TOKEN_EXPIRY`: Set to 10 days as default.
   - `FREEAPI_HOST_URL`: Set it as generated railway url.

6. Once you fill in the required environment parameters, if you choose to add others such as PayPal, Google, and Razorpay, please proceed to mention your credentials in the form.

7. Click on the **Deploy** button to trigger the first build.
   - Monitor the server logs; if you come across any deployment problems, feel free to raise an issue for our team to look into.

Note: Once the application is deployed, please wait for 3-5 minutes for the swagger docs to be available.

# 🧪 Testing

To ensure reliability & stability for our end users, we utilize Playwright, a powerful testing framework to automate testing across all endpoints.

### 💻 Run the Test Server

Make sure to add `MONGO_MEMORY_SERVER_PORT=10000` (mongodb port for e2e testing) in your `.env` file.

```bash
yarn start:test-server
```

### 🧪 Run Tests

```bash
yarn test:playwright
```

This will generate a Playwright report. To view this report run the following command

```bash
yarn playwright show-report
```

Make sure all the test cases are passed whenever you make any changes.

# How to contribute - Guidelines

## ⚡️ Contribute in core FreeAPI codebase:

We welcome your interest in contributing to our open source project!

To contribute to FreeAPI, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feat/your-feature-name` or `git checkout -b fix/your-bug-fix-name` and make your changes.
3. Run all the tests 🧪 before committing the changes and make sure all tests are passed.
4. After all tests are passed, commit your changes with a descriptive messages: `git commit -am 'add your commit message'`
5. For more details on the commit format and other guidelines, please refer to the [Contributor Guidelines](./CONTRIBUTING.md).
6. Push your changes to your forked repository: `git push origin feat/your-feature-name`.
7. Submit a pull request to the main repository, explaining the changes you've made and providing any necessary details.

Here's a guide on how you can effectively contribute to our API hub:

1. Pull Requests for Readme Updates: Please refrain from sending pull requests solely for updating the project's readme file. While we appreciate the importance of clear and concise documentation, we prefer to focus on substantial code contributions and feature enhancements.

2. Grammar Updates: Our team values effective communication, but we're not grammar sticklers. You don't need to send pull requests solely for grammar fixes or minor language improvements. Instead, concentrate on the core functionalities and features of the project.

3. Avoid Updating Existing Public APIs: To maintain stability and consistency, we discourage direct updates to existing public APIs within the API hub. These APIs have been thoroughly tested and approved. However, if you encounter any bugs or issues, we encourage you to open an issue on our project's issue tracker to notify us.

4. Build New Project APIs: We encourage you to explore your creativity and contribute by building complete project APIs. These APIs should provide comprehensive solutions that can assist developers in constructing complex projects to showcase their skills and abilities. Your contributions in this area will greatly benefit the community.

5. Draft a Proposal and Discuss on Discord: Before diving into your project, we recommend drafting a proposal. This can include a mind map or outline of the API you intend to build and its potential benefits. Join our Discord community, where you can share your proposal, discuss ideas, and gather feedback from fellow contributors. Engaging in these discussions will enhance your backend portfolio and help shape the future direction of the project.

We appreciate your enthusiasm and look forward to your valuable contributions to our open source API hub project.

Together, we can foster a collaborative environment and make a significant impact in the API integration landscape.

Click [here](https://github.com/hiteshchoudhary/apihub/blob/main/CONTRIBUTING.md) for detailed contribution guide.

## 🚀 Contribute by creating frontend application:

Thank you for your interest in contributing to the FreeAPI project by creating frontend applications consuming FreeAPIs! Your efforts play a crucial role in enhancing the user experience and expanding the reach of our APIs. Please follow this guide to ensure a smooth and collaborative contribution process.

Click [here](https://github.com/hiteshchoudhary/apihub/blob/main/CONTRIBUTING_FRONTEND.md) for detailed contribution guide for Frontend Developers 🚀!

## 🧪 Contribute in testing suite

Thank you for your interest in contributing to the FreeAPI project to increase code coverage of our API service that helps us to ship robust endpoints that are battlefield tested. Please follow this guide to ensure a smooth and collaborative contribution process.

Click [here](https://github.com/hiteshchoudhary/apihub/blob/main/CONTRIBUTING_CODE_COVERAGE.md) for detailed contribution guide for increasing code coverage.

# 📜 Swagger Docs

[Swagger Docs](https://api.freeapi.app): https://api.freeapi.app

NOTE: Swagger docs are auto generated from the `swagger.yaml` file. While running the project locally, make sure you change the url to `http://localhost:<port_from_.env>/api/v1` in the swagger docs `servers/url` field.
