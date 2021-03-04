const API = require("./lib/API");
const readlineSync = require("readline-sync");

function calculateAverageRating(movie) {
    let total = 0;
    for (const review of movie.reviews) {
        total += parseInt(review.rating);
    }
    return total / movie.reviews.length;
}

function displayMoviesSummary(movies) {
    for (const movie of movies) {
        if (movie.reviews.length > 0) {
            console.log(
                `--- ${movie.id}: ${movie.title}, rating: ${calculateAverageRating(
          movie
        )}`
            );
        } else {
            console.log(`--- ${movie.id}: ${movie.title}, no reviews yet!`);
        }
    }
}

function displayMovieDetails(movie) {
    console.log(`-- ${movie.title} --`);
    for (const review of movie.reviews) {
        console.log(`${review.content} - Rating: ${review.rating}`);
    }
}

function chooseAMovieId(movies) {
    for (const movie of movies) {
        console.log(`--- ${movie.id}: ${movie.title}`);
    }

    // user inputs an ID number
    const movieChoice = readlineSync.question(
        "Which number movie would you like to delete? "
    );
    const movie = API.read("movies", movieChoice);

    // if the API can't find that movie
    // run chooseAmovie again
    if (movie !== undefined) {
        return movieChoice;
    } else {
        console.log("Ooops we can't find that movie!");
        return chooseAMovieId(movies);
    }
}

function chooseAMovie(movies) {
    // display each ID and title
    for (const movie of movies) {
        console.log(`--- ${movie.id}: ${movie.title}`);
    }

    // user inputs an ID number
    const movieChoice = readlineSync.question(
        "Which number movie would you like to review? "
    );
    const movie = API.read("movies", movieChoice);

    // if the API can't find that movie
    // run chooseAMovie again
    if (movie !== undefined) {
        return movie;
    } else {
        console.log("Ooops we can't find that movie!");
        return chooseAMovie(movies);
    }
}

function mainMenu() {
    console.log("----------------");
    console.log("---- Movies ----");
    console.log("----------------");
    console.log("1. View available movies");
    console.log("2. Leave a review");
    console.log("3. Add a new Movie");
    console.log("4. Delete a movie");
    console.log("----------------");

    const choice = readlineSync.question("Please choose an option ");

    if (choice === "1") {
        console.log("-----------------");
        console.log("- ALL OUR MOVIES -");
        console.log("-----------------");

        // get all movies
        const movies = API.read("movies");
        displayMoviesSummary(movies);

        // return to main menu
        mainMenu();
    } else if (choice === "2") {
        console.log("-----------------");
        console.log("- CHOOSE A Movie -");
        console.log("-----------------");

        const movies = API.read("movies");
        const movie = chooseAMovie(movies);
        displayMovieDetails(movie);

        // Input review details
        const rating = readlineSync.question("What is your rating? ");
        const content = readlineSync.question("Please write your review ");

        // add the new review to the movie reviews
        movie.reviews.push({
            rating: rating,
            content: content,
        });

        // update the movie in the API
        API.update("movies", movie);

        console.log("----------------------------");
        console.log("Thanks for leaving a review!");
        console.log("----------------------------");

        // return to main manu
        mainMenu();
    } else if (choice === "3") {
        console.log("-----------------");
        console.log("- ADD A NEW Movie -");
        console.log("-----------------");

        const newMovie = readlineSync.question("Enter a new movie name: ");
        API.create("movies", { title: newMovie, reviews: [] });

        console.log("-----------------------------");
        console.log("Thanks for adding a new movie");
        console.log("-----------------------------");

        mainMenu();
    } else if (choice === "4") {
        console.log("----------------------");
        console.log("- Delete A NEW Movie -");
        console.log("----------------------");

        const movies = API.read("movies");
        const movieId = chooseAMovieId(movies);

        API.destroy("movies", parseInt(movieId));

        console.log("-----------------------");
        console.log("Movie has been deleted!");
        console.log("-----------------------");

        mainMenu();
    } else {
        console.log("Sorry we didn't recognise that choice!");
        mainMenu();
    }
}

mainMenu();