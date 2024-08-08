import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
    {
        title: String,
        publishingYear : Number,
        poster : {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.models.Movie || mongoose.model( "Movie", movieSchema );

export default Movie;