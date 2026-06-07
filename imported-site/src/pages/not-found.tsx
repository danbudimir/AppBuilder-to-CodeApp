export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-pa-control-id="src/pages/not-found.tsx:3:5-17:11">
      <div className="text-center" data-pa-control-id="src/pages/not-found.tsx:4:7-16:13">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4" data-pa-control-id="src/pages/not-found.tsx:5:9-5:79" data-pa-text-content-editable="true">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2" data-pa-control-id="src/pages/not-found.tsx:6:9-6:88" data-pa-text-content-editable="true">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md" data-pa-control-id="src/pages/not-found.tsx:7:9-9:13" data-pa-text-content-editable="true">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-pa-control-id="src/pages/not-found.tsx:10:9-15:13" data-pa-text-content-editable="true">
          Go Back Home
        </a>
      </div>
    </div>
  );
}

