import Link from "next/link";
import AIgen from "./AIgen";
import Head from "next/head";
export default function Home() {
  return (
    <div>
      <Head>
        <title>GenAI Assistant | DevOps</title>
      </Head>

      <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900 text-white font-sans">
        <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b border-purple-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-transparent bg-clip-text">
                AI Assistant
              </span>
            </Link>
          </div>
        </header>
        {/* Main content grows to fill height */}
        <main className="flex-grow flex flex-col items-center text-center mt-20 px-4">
          {/* Tool Sections */}
          <div className="w-full max-w-6xl px-4 mb-12">
            <AIgen />
          </div>
        </main>

        <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-800">
          &copy; 2025 AI Assistant All rights reserved.
        </footer>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out both;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}
