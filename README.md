# DevTrack — Internship Application Tracker

DevTrack is a responsive, browser-based dashboard for organizing internship and job applications. It lets a student keep track of where they applied, what stage each application is in, and when to follow up.

## Features

- **Create, read, update, and delete (CRUD)** application records.
- Dashboard statistics for total applications, in-progress applications, interviews, and offers.
- Search by company, role, or notes.
- Filter by application status and sort by date or company.
- Optional follow-up dates, job-posting links, and notes.
- Persistent browser storage with `localStorage`.
- Export records to a CSV file.
- Responsive layout for desktop, tablet, and mobile.
- Form validation and accessible labels / status messages.

## Tech stack

| Technology | How it is used |
|---|---|
| HTML5 | Page structure, forms, tables, and semantic elements |
| CSS3 | Responsive layout, dashboard styling, status colors, and dialog |
| JavaScript (ES6+) | Application logic, events, filtering, sorting, and rendering |
| Web Storage API | Saves records in the browser with `localStorage` |
| Blob / URL APIs | Creates the downloadable CSV export |

No frameworks, package manager, database, or build step are required.

## Run locally

1. Download or clone this repository.
2. Open the `index.html` file in a modern browser.

For a local development server, you can also run this from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```text
DevTrack/
├── index.html    # App layout and form dialog
├── styles.css    # Responsive visual design
├── app.js        # Data, interactions, and local storage
└── README.md     # Project documentation
```

## How data is stored

Application records are stored in the browser's `localStorage` under the key:

```text
devtrack_applications_v1
```

This means data stays in the same browser on the same device. It is not synced to an account or shared between devices. Clearing browser site data can remove saved records. Use the CSV export to keep a separate copy.

## Skills demonstrated

### Programming
- JavaScript variables, arrays, objects, functions, and conditionals
- Array methods such as `map`, `filter`, `find`, and `sort`
- DOM selection and dynamic HTML rendering
- Event listeners and event delegation
- Form handling and client-side validation
- JSON serialization and parsing
- Browser storage and file download APIs

### Web development
- Semantic HTML and accessible form controls
- CSS Grid, Flexbox, responsive media queries, and custom properties
- Responsive dashboard design
- Dialog-based forms and status feedback
- Separation of structure, styling, and application logic

### Software engineering
- CRUD operations
- Data modeling
- Search, filtering, and sorting
- Defensive handling of malformed stored data
- Basic input sanitization when rendering user-provided text
- Documentation and Git/GitHub project organization

## Suggested improvements

These are good next steps once you understand the current version:

1. Add automated tests for filtering, sorting, and form validation.
2. Add a backend API and database so records can sync across devices.
3. Add user accounts and authentication.
4. Add reminders for upcoming follow-up dates.
5. Add charts showing application activity over time.
6. Deploy the site with GitHub Pages or another static hosting service.

## GitHub setup

Create a new empty GitHub repository named `devtrack-internship-tracker`, then run these commands inside this project folder:

```bash
git init
git add .
git commit -m "Build DevTrack internship application tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/devtrack-internship-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Resume description

**DevTrack — Internship Application Tracker**  
Designed and built a responsive internship application dashboard using HTML, CSS, and JavaScript. Implemented CRUD functionality, dynamic search and filtering, application status metrics, browser-based persistence with `localStorage`, and CSV export.

Only list technologies and features you can explain confidently. A good next step is to customize the design, add tests, and deploy a live demo.

## License

This project is available under the MIT License. Add a `LICENSE` file if you choose to publish it under that license.
