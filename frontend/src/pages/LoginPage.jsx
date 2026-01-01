import Navbar from "../components/NavBar";
import Login from "../components/Auth/Login";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Log in to your account
          </h2>
          <Login />
        </div>
      </div>
    </>
  );
}
