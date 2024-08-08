import { NextResponse } from "next/server";
import connectMongoDb from "../../../libs/mongodb";
import Movie from "../../../models/movie";
import { writeFile } from 'fs/promises';
import path from 'path';
import { unlink } from 'fs/promises';


export async function POST(request) {
    try {
        await connectMongoDb();
        const data = await request.formData();
        const file = data.get('poster'); // Use 'poster' here

        if (!file) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }
        
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);
        const path = `./public/${file.name}`;
        await writeFile(path, buffer);

        const newMovie = { title: data.get('title'), publishingYear: data.get('publishingYear'), poster: file.name };
        await Movie.create(newMovie);
        return NextResponse.json({ message: "Movie Created", movie: newMovie }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Error processing file" }, { status: 500 });
    }

}


export async function GET() {
    try {
      await connectMongoDb();
      
      const movies = await Movie.find().limit(3);
      return NextResponse.json({ movies }, { status: 200 });
    } catch (error) {
      console.error('Error fetching movies:', error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        await connectMongoDb();

        const movie = await Movie.findById(id);

        if (!movie) {
            return NextResponse.json({ message: "Movie not found" }, { status: 404 });
        }

        // Delete the file
        const filePath = path.join('./public', movie.poster);
        await unlink(filePath);

        // Delete the movie record
        await Movie.findByIdAndDelete(id);

        return NextResponse.json({ message: "Movie Deleted" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

