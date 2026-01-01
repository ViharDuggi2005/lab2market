import Navbar from "../components/NavBar";

export default function Home() {
  return (
    <>
      <Navbar />

      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#2a73d9] px-6 text-center">
        <div className="max-w-4xl text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Connect Research Innovation with <br />
            Strategic Investment
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            lab2market bridges the gap between Indian researchers and investors,
            creating meaningful partnerships that drive innovation from
            laboratory to market.
          </p>

          <div className="mt-8 flex justify-center gap-6">
            <button
              className="cursor-pointer rounded-xl bg-[#1363d4] px-8 py-3 font-semibold text-white 
             transition-all hover:shadow-xl hover:shadow-blue-900/30"
            >
              I'm a Researcher
            </button>

            <button
              className="cursor-pointer rounded-xl bg-white px-8 py-3 font-semibold text-[#1363d4]
             transition-all hover:shadow-xl hover:shadow-blue-900/30"
            >
              I'm an Investor
            </button>
          </div>
        </div>
      </section>
      {/* featured carousel removed */}
    </>
  );
}
