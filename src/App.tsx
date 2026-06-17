import { useBoard } from './hooks/useBoard'
import { Board } from './components/Board'

function App() {
  const { applications, moveApplication } = useBoard()

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border px-6 py-4 flex items-center">
        <span className="text-[17px] font-semibold text-ink tracking-tight">Onward</span>
      </header>
      <main className="p-6">
        <Board applications={applications} onMove={moveApplication} />
      </main>
    </div>
  )
}

export default App
