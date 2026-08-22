# Lost-and-found-Team-2

Modern Programming Language (601316) project — Lost and Found System.
Node.js + Express + EJS, Bootstrap 5 via CDN.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:8080

## Pages

| Route | Page | View |
|---|---|---|
| `/` | Home | `views/index.ejs` |
| `/about` | About | `views/about.ejs` |
| `/items` | Items list | `views/items.ejs` |
| `/items/:id` | Item details (URL parameter) | `views/item-details.ejs` |
| `/contact` | Contact form (GET + POST) | `views/contact.ejs` |
| anything else | 404 catch-all | `views/404.ejs` |

## Who wrote what

| Team member | Task |
|---|---|
| Azmi Hijazi (leader) | Project setup, `app.js`, Home page, header partial |
| Hashem Zeitoun | About page, footer partial |
| Abdulrahman Al-Absi | Items page, items array, navigation partial |
| Omar Harz Allah | Item details page (`:id` route), Express routing |
| Ahmad | Contact page, 404 page, styling |

## Structure

```
app.js            Express setup, middleware, router mounting, 404 catch-all
routes/           index.js (home, about, contact), items.js (list, :id)
views/            page templates
views/partials/   header.ejs, nav.ejs, footer.ejs
public/           static files served by express.static
models/           reserved for Mongoose models (Phase 3)
```
