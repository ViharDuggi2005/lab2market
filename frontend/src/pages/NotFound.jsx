export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-700">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-gray-500">
        The page you are looking for doesn’t exist or may have been moved.
      </p>

      <a
        href="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Go back home
      </a>
    </div>
  );
}
