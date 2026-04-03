# H.A.D CREATIONS

This project is prepared for free deployment with Vercel and Supabase.

## Structure

- `public/` contains the website frontend
- `api/` contains Vercel serverless functions
- `supabase/schema.sql` creates the enquiry table

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run the SQL from `supabase/schema.sql`.
4. Copy your project URL and service role key.

## Environment Variables

Add these in Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Use `.env.example` as the format reference.

## Routes

- `/` website homepage
- `/api/site-content` content endpoint
- `/api/contact` enquiry create/list endpoint
- `/api/contact/export` Excel export endpoint

## Deploy

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables.
4. Deploy.
