import { NextResponse } from "next/server";
import connectMongoDb from "../../../libs/mongodb";
import Movie from "../../../models/movie";

export const config = {
    api: {
        bodyParser: false
    }
};

export async function POST(request) {
    return new Promise((resolve, reject) => {
        upload.single('poster')(request, null, async (err) => {
            if (err) {
                return reject(NextResponse.json({ message: "File upload failed" }, { status: 500 }));
            }

            try {
                const { title, publishingYear } = request.body;
                const poster = request.file.path;

                console.log(poster)

                if (!title || !publishingYear || !poster) {
                    return resolve(NextResponse.json({ message: "Invalid data" }, { status: 400 }));
                }

                await connectMongoDb();

                const newMovie = await Movie.create({ title, publishingYear, poster });

                resolve(NextResponse.json({ message: "Movie Created", movie: newMovie }, { status: 201 }));
            } catch (error) {
                console.error('Error creating movie:', error);
                resolve(NextResponse.json({ message: "Internal Server Error" }, { status: 500 }));
            }
        });
    });
}

export async function GET() {
    try {
        await connectMongoDb();
        const movies = await Movie.find();
        return NextResponse.json({ movies }, { status: 200 });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

import fs from 'fs';
import path from 'path';
import upload from "../../../middleware/upload";

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        await connectMongoDb();

        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return NextResponse.json({ message: "Movie not found" }, { status: 404 });
        }

        // Delete the poster image file
        const posterPath = path.join(process.cwd(), deletedMovie.poster);
        fs.unlink(posterPath, (err) => {
            if (err) {
                console.error('Error deleting poster file:', err);
            }
        });

        return NextResponse.json({ message: "Movie Deleted" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
