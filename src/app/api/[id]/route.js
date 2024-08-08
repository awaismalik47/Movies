import { NextResponse } from 'next/server';
import connectMongoDb from '../../../../libs/mongodb';
import Movie from '../../../../models/movie';


export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title: title, publishingYear: publishingYear, poster: poster } = await request.json();

    if (!id || !title || !publishingYear || !poster) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await connectMongoDb();

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, publishingYear, poster },
      { new: true } // This returns the updated document
    );

    if (!updatedMovie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie Updated", movie: updatedMovie }, { status: 200 });
  } catch (error) {
        console.error('Error updating movie:', error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
