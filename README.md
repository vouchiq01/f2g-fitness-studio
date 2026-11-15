# F2G Fitness Studio website

Static, no-build site (HTML/CSS/JS). Open `index.html` or deploy to Vercel/Netlify/GitHub Pages.

## Setup
1. Edit `config.js`: WhatsApp number, phone, hours, Google profile link.
2. (Optional) Supabase: create a project, run `supabase/schema.sql`, then paste the Project URL and **anon** key into `config.js`. Booking requests then also save to the `booking_requests` table. The anon key is safe to expose because RLS allows insert only.
3. Booking form always opens WhatsApp with a pre-filled message, even without Supabase.
