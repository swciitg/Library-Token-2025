export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-md mt-4 w-80 mx-auto text-center">
      <p className="font-semibold mb-2">Something went wrong:</p>
      <pre className="whitespace-pre-wrap text-sm">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
      >
        Try Again
      </button>
    </div>
  );
}
