// app/sketchfab/[id]/page.tsx
import { NextRequest, NextResponse } from 'next/server';

// This interface defines the shape of the data that will be returned from the API endpoint
interface SketchfabData {
  title: string;
  description: string;
  thumbnailUrl: string;
  downloadUrl: string;
}

// This is a Next.js API route handler function that will be executed when a GET request is made to the endpoint
export async function GET(request: NextRequest) {
  // Extract the ID from the URL path
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  // If the ID is not provided, return an error response
  if (!id) {
    return NextResponse.json({ error: 'Invalid Sketchfab ID' }, { status: 400 });
  }

  try {
    // Fetch the Sketchfab model page using the provided ID
    const response = await fetch(`https://sketchfab.com/models/${id}`);
    const html = await response.text();

    // Parse the HTML response using the DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract the relevant data from the HTML
    const title = doc.querySelector('h1.Title_title__3Iq7V')?.textContent?.trim() || '';
    const description = doc.querySelector('div.Description_description__2Iq_V')?.textContent?.trim() || '';
    const thumbnailUrl = doc.querySelector('img.Asset_thumbnail__2Ej_x')?.getAttribute('src') || '';
    const downloadUrl = doc.querySelector('a.Button_button__1Iq_V[href*="download"]')?.getAttribute('href') || '';

    // Create the SketchfabData object with the extracted data
    const data: SketchfabData = {
      title,
      description,
      thumbnailUrl,
      downloadUrl,
    };

    // Return the SketchfabData object as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    // If there's an error during the scraping process, log the error and return a 500 error response
    console.error('Error scraping Sketchfab:', error);
    return NextResponse.json({ error: 'Error scraping Sketchfab' }, { status: 500 });
  }
}