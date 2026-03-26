import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-sans selection:bg-[#FF00FF] selection:text-black flex flex-col bg-static tear">
      {/* Header */}
      <header className="w-full p-6 border-b-4 border-[#FF00FF] bg-black z-10">
        <h1 className="text-3xl md:text-5xl font-mono glitch text-center" data-text="SYS.NEON_SNAKE.EXE">
          SYS.NEON_SNAKE.EXE
        </h1>
        <p className="text-[#FF00FF] font-sans text-2xl mt-4 text-center tracking-widest">
          [STATUS: ONLINE] // PROTOCOL: GLITCH_ART
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 lg:p-12 relative">
        {/* Game Area */}
        <div className="z-10 flex-1 flex justify-center w-full max-w-2xl">
          <SnakeGame />
        </div>

        {/* Sidebar / Music Player */}
        <div className="z-10 w-full lg:w-96 flex flex-col gap-8">
          <div className="bg-black border-4 border-[#00FFFF] p-6 shadow-[8px_8px_0px_#FF00FF]">
            <h2 className="text-3xl font-mono text-[#FF00FF] mb-5 tracking-wider border-b-4 border-[#00FFFF] pb-2">
              &gt; MANUAL_OVERRIDE
            </h2>
            <ul className="text-[#00FFFF] text-2xl space-y-4 font-sans">
              <li className="flex items-center gap-3">
                <span className="bg-[#FF00FF] text-black px-2 py-1 font-bold">↑↓←→</span> 
                NAVIGATE_MATRIX
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-[#FF00FF] text-black px-2 py-1 font-bold">SPACE</span> 
                HALT_EXECUTION
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#FF00FF] text-3xl">■</span> 
                CONSUME_DATA_PACKETS
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#FF00FF] text-3xl">✗</span> 
                AVOID_SYSTEM_CRASH
              </li>
            </ul>
          </div>

          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
