import Link from "next/link";
import AIgen from "./AIgen";
import Head from "next/head";
export default function Home() {
  return (
    <div>
      <Head>
        <title>GenAI Assistant</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-200 text-white font-sans">
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-500 to-slate-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <span className="text-2xl font-bold bg-white text-transparent bg-clip-text">
                AI Assistant
              </span>
            </Link>
          </div>
        </header>
        <main className="flex-grow flex flex-col items-center  mt-20 px-4">
          <div className="w-full max-w-6xl px-4 mb-12">
            <AIgen />
          </div>
        </main>

        <footer className="text-center text-sm text-white py-4 border-t border-gray-800">
          &copy; 2025 AI Assistant All rights reserved.
        </footer>
      </div>
    </div>
  );
}
