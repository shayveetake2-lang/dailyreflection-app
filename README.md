# Daily Reflection

A small, local-only daily reflection form built with React, TypeScript, Vite, and Tailwind CSS.

## Privacy

Reflection data is kept only in the browser's memory for the current page session. The app has no authentication, analytics, database, or server-side reflection storage. Closing or refreshing the page clears the session history.

The form is hosted as a static site on Firebase Hosting. Hosting serves the application files but does not receive reflection contents through the app.

## Development

```bash
npm install
npm run dev
```

Run the production checks with:

```bash
npm run lint
npm run build
```

## Deployment

The Firebase Hosting project is configured in `.firebaserc`. Build the app, then deploy Hosting only:

```bash
npm run build
npx firebase-tools deploy --only hosting
```
