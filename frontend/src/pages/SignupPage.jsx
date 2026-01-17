import Navbar from "../components/NavBar";
import Register from "../components/Auth/Register";

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Create an account
          </h2>
          <Register />
        </div>
      </div>
    </>
  );
}
