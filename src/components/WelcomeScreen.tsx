'use client';

interface WelcomeScreenProps {
  onNext: () => void; // Callback to proceed to the next step
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-astral-dark text-astral-light p-4 sm:p-8 flex flex-col items-center justify-center">
      <header className="mb-10 text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-esoteric-purple filter drop-shadow-[0_0_5px_rgba(126,87,194,0.8)] mb-6">
          Welcome, Seeker of Truth
        </h1>
        <p className="text-lg text-astral-light/90 mb-4 leading-relaxed">
          You stand at the threshold of understanding. Tarot is a sacred mirror, reflecting the energies that surround your query and offering glimpses into the currents of fate and free will.
        </p>
        <p className="text-md text-cosmic-blue mb-6 leading-relaxed">
          This digital oracle will guide you in the ancient art of divination. Prepare your physical Tarot deck, for the true connection lies between you, your cards, and the universe.
        </p>
      </header>

      <main className="w-full max-w-2xl bg-astral-bg shadow-2xl shadow-esoteric-purple/30 rounded-lg p-6 sm:p-8 ring-1 ring-esoteric-purple/50">
        <section className="mb-8 prose-tarot prose-sm max-w-none">
          <h2 className="text-2xl font-semibold text-starlight-gold mb-3">Preparing for Your Reading:</h2>
          <ol className="list-decimal pl-5 space-y-3 text-astral-light/80 leading-relaxed">
            <li>
              <strong>Find a Quiet Space:</strong> Choose a location where you will not be disturbed. Light a candle or incense if it helps you focus.
            </li>
            <li>
              <strong>Center Your Mind:</strong> Take a few deep breaths. Clear your thoughts of daily distractions. Focus on the question or situation you wish to explore.
            </li>
            <li>
              <strong>Handle Your Cards:</strong> Hold your physical Tarot deck. Shuffle the cards in a way that feels right to you, infusing them with your energy and your question.
            </li>
            <li>
              <strong>Set Your Intention:</strong> Clearly state your question or the area of guidance you seek, either aloud or in your mind. Be open to the messages the cards will reveal.
            </li>
          </ol>
        </section>

        <section className="mb-8 prose-tarot prose-sm max-w-none">
          <h2 className="text-2xl font-semibold text-starlight-gold mb-3">How This Oracle Works:</h2>
          <p className="text-astral-light/80 leading-relaxed">
            Once you are centered and your cards are shuffled with intention, you will proceed to choose a spread that best suits your query. This app will then guide you to identify the cards you have physically drawn for each position in that spread. Finally, the collective wisdom of the Tarot will be channeled to provide an interpretation.
          </p>
        </section>

        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-esoteric-purple hover:bg-starlight-gold hover:text-astral-dark text-white font-semibold py-3 px-8 rounded-md shadow-lg hover:shadow-starlight-gold/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-astral-bg focus:ring-starlight-gold transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
            I Am Prepared - Continue
          </button>
        </div>
      </main>

      <footer className="mt-16 mb-8 text-center text-xs text-astral-light/50">
        <p>The journey within begins with a single focused thought.</p>
      </footer>
    </div>
  );
} 