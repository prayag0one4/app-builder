# G-Redirect

A lightweight, responsive web application that serves as a custom start page for Google searches. It features a clean, minimalist interface with automatic dark mode support and seamless redirection to search results.

## Features

- **Automatic Redirection**: Enter a search query into the input field and be automatically redirected to the corresponding Google Search results page.
- **Dark Mode Support**: 
  - Automatically detects your operating system's color scheme preference on load.
  - Includes a manual toggle button (Sun/Moon icon) to switch between Light and Dark themes instantly.
- **Responsive Design**: Built with CSS3 and Flexbox to ensure a consistent experience across desktop and mobile devices.

## Tech Stack

- **React**: A JavaScript library for building the user interface.
- **CSS3**: Used for styling, including CSS Variables for dynamic theming and media queries for responsiveness.
- **Node.js & npm**: Used for the development environment, dependency management, and build scripts.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)

## Setup Instructions

Follow these steps to set up the project for local development:

1. **Navigate to the project directory**
   ```bash
   cd path/to/G-Redirect
   ```

2. **Install dependencies**
   Run the following command to install all required packages listed in `package.json`:
   ```bash
   npm install
   ```

3. **Start the development server**
   Launch the application in your local environment:
   ```bash
   npm start
   ```

   The application will open automatically in your default browser at [http://localhost:3000](http://localhost:3000). If it does not open, manually navigate to that URL.

## Usage

1. **Search**: Type your search query into the central input box and press **Enter** (or click outside the box if configured to submit on blur, though currently it requires a form submission event).
2. **Toggle Theme**: Click the **Sun/Moon icon** in the top-right corner to manually switch between Light and Dark mode.

## Project Structure


- `public/index.html`: The HTML template.
- `src/App.js`: The main React component containing logic for search redirection and theme toggling.
- `src/App.css`: The stylesheet containing CSS variables for theming and layout styles.
