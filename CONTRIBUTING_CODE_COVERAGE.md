# FreeAPI Testing Contribution Guide

Thank you for your interest in contributing to the FreeAPI project to help us deliver our APIs that are battlefield tested. To ensure reliability & stability for our end users, we utilize Playwright, a powerful testing framework to automate testing across all endpoints.

### Why Playwright?

After exploring our open-source community options such as Jest, Jasmine & Playwright. We decided to move forward with the playwright as it facilitates automated testing, offers cross-browser support, rich enough API with familiar syntax.

## ⚠️ Important Note:

### Before starting your contribution

- create an issue stating which module you will be working on
- in a given module if tests exist, we do not welcome them as long as it is a logical fix
- test coverage for example frontend apps are not our top priority

**IMPORTANT: Contributor must create an issue with [Testing Contribution](https://github.com/hiteshchoudhary/apihub/issues/new?assignees=&labels=testing&projects=&template=code_coverage.yaml&title=TESTING%3A+%3Ctitle%3E) issue template.**

This ensures coordination and prevents duplicated efforts.

## Table of Contents

1. [🏁 Getting Started](#getting-started)
2. [👆🏻 Choosing a Module](#choosing-a-module)
3. [🗂️ Folder Structure](#folder-structure-main)
4. [📙 Coding Standards](#coding-standards)
5. [📝 Dependency Management](#dependency-management)
6. [📨 Submitting Your Contribution](#submitting-your-contribution)

## Getting Started <a name="getting-started"></a>

### Fork the Repository

Start by forking the FreeAPI project repository to your GitHub account.

### Clone Your Fork

Clone your fork of the repository to your local machine.

```bash
git clone https://github.com/<your_username>/apihub.git
cd apihub
```

### Install Dependencies

Make sure you have the necessary dependencies of FreeAPI installed for the frontend framework or library you plan to use.

Follow this [README.md section](https://github.com/hiteshchoudhary/apihub/blob/main/README.md#-installation) to know more about setting up the FreeAPI environment

## Choosing a Module <a name="choosing-a-module"></a>

Decide which module you want to contribute to. Browse the `/apps`, `/public`, or `/kitchen-sink` modules to explore the available modules and APIs. Read the following section carefully to understand the folder structure you need to follow to increase your chances of getting your PR approved.

## Folder Structure <a name="folder-structure-main"></a>

Follow the specified folder structure for your frontend application (**The folder names must not follow the camel casing to keep things consistent.** _Your actual project code folders may have camel casing_):

```
ROOT_FOLDER/e2e/{module}/
```

See the following examples with context for the above structure:

## Example: Todo endpoint testing

Imagine you want to test the todo endpoint that is part of `/apps` module of the FreeAPI project. To keep a consistent folder structure for backtracking name your files with name identifier, but with an extension of `.test.js`.

### Folder Structure:

```
$ROOT_FOLDER/e2e/{package}/{module}/{file-indicator}.test.js
```

## Explanation for the examples:

- `ROOT_FOLDER`: Refers to the root directory of the FreeAPI project.

- `e2e`: This directory is designated for including test cases.

- `{package}`: The directory contains typical of a Node.js application: `app.js` initializes the app, `controllers` handle requests, `models` define data structures, `routes` map endpoints, `utils` provide utilities, and others manage logging, authentication, and database interactions.

- `{module}`: `apps` or `public` or `kitchen-sink`: Denotes the chosen module (`/apps` for complex apps, `/public` for public APIs, `/kitchen-sink` for backend-related static APIs. These folders are already created officially).

- `{file-indicator}`: This is the actual file name indicator that helps to identify for which file you are writing test cases for example: `todo.test.js`

By following this standardized folder structure, contributors can easily organize their front-end projects, making it convenient for others to explore, understand, and replicate the implementation.

## Coding Standards <a name="coding-standards"></a>

Adhere to the coding standards of the playwright framework. Additionally, consider the following guidelines:

- Use clear descriptive test suite & block names
- Follow best practices for unit, integration & end-to-end testing
- Ensure your code is well-documented by comments wherever necessary
- Make sure to add both positive & negative test cases

## Dependency Management <a name="dependency-management"></a>

Ideally, we do not encourage you to include a new package. Confine your code practices within the available dependencies to avoid overheads. Please state with a clear explanation with examples if you add anything new.

## Submitting Your Contribution <a name="submitting-your-contribution"></a>

Click [here](https://github.com/hiteshchoudhary/apihub/blob/main/CONTRIBUTING.md) for a detailed contribution guide on submitting a PR.

Thank you for your contribution to FreeAPI! Your dedication helps make our APIs more accessible and valuable to the community. If you have any questions or need assistance, feel free to reach out to our [Discord](https://hitesh.ai/discord).

Thank you for being part of the FreeAPI community and contributing to the project! We look forward to featuring your fantastic work. 🌟

Happy coding! 🚀
