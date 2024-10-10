
# Sulmeulliae Frontend

This project is the frontend of the Sulmeulliae web application, built using React. It interacts with a Django REST Framework (DRF) backend to display evaluations, community posts, and related content. The frontend is responsible for user interaction, displaying data fetched from the API, and providing forms for user input.

## Project Structure

- **`src/index.js`**: Entry point of the React app.
- **Components**:
  - **Evaluation**:
    - `EvaluationList.js`: Lists all evaluations.
    - `EvaluationDetail.js`: Displays the details of a specific evaluation.
    - `ReviewList.js`: Shows reviews associated with an evaluation.
  - **Community**:
    - `FreeBoard.js`, `DiscussionBoard.js`, `QuestionBoard.js`, `DrinkMateBoard.js`: Different boards for community interaction.
    - `CommunityDetail.js`: Shows the details of a community post.
    - `CommentList.js`: Lists comments related to a community post.
    - `CreatePost.js`: Form for creating new community posts.
  - **User Management**:
    - `Signup.js`: Handles user signup.
    - `Login.js`: Handles user login.
  - **Forms**:
    - `CommentForm.js`: Form for submitting comments.
    - `ReviewForm.js`: Form for submitting reviews.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/sulmeulliae-frontend.git
   cd sulmeulliae-frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Features

- **Evaluation List**: Users can browse evaluations without logging in.
- **Evaluation Details**: View detailed information about a specific evaluation, including reviews.
- **Community Boards**: Users can browse posts in different community boards (Free Board, Discussion Board, Question Board, Drink Mate Board).
- **User Authentication**: Users can sign up and log in to access personalized features such as posting and commenting.
- **Post Creation**: Logged-in users can create posts in different community boards.
- **Comments and Reviews**: Users can leave comments on community posts and reviews on evaluations.

## API Integration

The frontend communicates with a Django DRF backend via REST APIs. All API calls are handled in `src/services/api.js`, which manages interaction with the backend endpoints.

## Running Tests

To run tests, use the following command:

```bash
npm test
```

## Build for Production

To build the app for production, use the following command:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## License

This project is licensed under the MIT License.

