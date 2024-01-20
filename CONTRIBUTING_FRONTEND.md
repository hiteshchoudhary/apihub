# FreeAPI Frontend Contribution Guide

Thank you for your interest in contributing to the FreeAPI project by creating frontend applications! Your efforts play a crucial role in enhancing the user experience and expanding the reach of our APIs. Please follow this guide to ensure a smooth and collaborative contribution process.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Choosing a Module](#choosing-a-module)
3. [Folder Structure](#folder-structure-main)
4. [Coding Standards](#coding-standards)
5. [Dependency Management](#dependency-management)
6. [Testing](#testing)
7. [Submitting Your Contribution](#submitting-your-contribution)
8. [Code of Conduct](#code-of-conduct)

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

Decide which module you want to contribute to. Browse the `/apps`, `/public`, or `/kitchen-sink` modules to explore the available modules and APIs. Read the following section carefully to understand the folder structure you need to follow to increase chances to get your PR approved.

## Folder Structure <a name="folder-structure-main"></a>

Follow the specified folder structure for your frontend application (**The folder names must not follow the camel casing to keep things consistent.** _Your actual project code folders may have camel casing_):

```
ROOT_FOLDER/examples/{module}/{app-name}/{platform}/{frontend-tech-used}/{project-code}
```

See the following examples with context for above structure:

## Example 1: Social Media Web App

Imagine you want to create a web application for the `social-media` project within the `/apps` module of the FreeAPI project. You've decided to use React.js for the frontend, manage state with Redux, and style the app with Tailwind CSS. Your project code will be a unique identifier for your application.

### Folder Structure:

```
$ROOT_FOLDER/examples/apps/social-media/web/react-redux-tailwind/<your_project_folders>
```

## Example 2: YouTube Mobile App

Suppose you are interested in building a mobile application that consumes the YouTube API from the `/public` folder of the FreeAPI project. For this, you've chosen Flutter as your framework, and you'll be using Riverpod for state management. Again, your project code will be a unique identifier for your application.

### Folder Structure:

```bash
$ROOT_FOLDER/examples/public/youtube/mobile/flutter-riverpod/<your_project_folders>
```

## Example 3: Status Code Lookup App

You want to contribute a frontend application to the `/kitchen-sink` module that allows users to input a numerical HTTP status code. The app will then provide details about that status code, such as its purpose and common usage with elegant UI.

## Folder Structure:

```bash
$ROOT_FOLDER/examples/kitchen-sink/statuscodes/web/react-tailwind/<your_project_folders>
```

## Explanation for the examples:

- **ROOT_FOLDER:** Refers to the root directory of the FreeAPI project.
- **examples:** This directory is designated for frontend examples.
- **{module} - apps or public or kitchen-sink:** Denotes the chosen module (`/apps` for complex apps, `/public` for public APIs, `/kitchen-sink` for backend-related static APIs. These folders are already created officially).
- **{app_name} - social-media or youtube or statuscode:** Specifies the name of the chosen app or API within the selected module. This folder is also created by default officially.
- **{platform} - web or mobile or desktop:** Defines the platform for which the frontend is developed (web or mobile or desktop etc).
- **{frontend-tech-used} - react-redux-tailwind or flutter-provider:** Indicates the frontend technology stack used, including the framework, UI-lib and state management tool (at least one tech tool name must be there).
- **<your_project_folders>:** Represents the actual project folders that will be coding.

By following this standardized folder structure, contributors can easily organize their frontend projects, making it convenient for others to explore, understand, and replicate the implementation.

## Coding Standards <a name="coding-standards"></a>

Adhere to the coding standards of the chosen frontend technology and framework. Additionally, consider the following guidelines:

- Use clear and descriptive variable and function names.
- Follow best practices for state management, component structure, and code organization.
- Ensure your code is well-documented by comments wherever necessary.
- Make sure to use type safe languages like TypeScript over javascript to code teh frontend
- **Include comprehensive README.md file for each project on how to do installation and setup for the respective apps**

## Dependency Management <a name="dependency-management"></a>

List all major dependencies/tech tools used in a clear and organized manner in your project README.md. Include version numbers to ensure compatibility.

## Testing (optional) <a name="testing"></a>

Write tests for your frontend application to ensure its functionality. Include instructions on how to run the tests.

## Submitting Your Contribution <a name="submitting-your-contribution"></a>

Click [here](https://github.com/hiteshchoudhary/apihub/blob/main/CONTRIBUTING.md) for detailed contribution guide on submitting a PR.

Thank you for your contribution to FreeAPI! Your dedication helps make our APIs more accessible and valuable to the community. If you have any questions or need assistance, feel free to reach out to our [community forum](https://exampleforum.com).

Happy coding! 🚀
