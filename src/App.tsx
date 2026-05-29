import { GameProvider, useGame } from './context/GameContext'
import { SettingsProvider } from './context/SettingsContext'
import { AudioProvider } from './context/AudioProvider'
import { AboutScreen } from './components/AboutScreen'
import { AudioController } from './components/AudioController'
import { CityView } from './components/CityView'
import { CrimeAlert } from './components/CrimeAlert'
import { GameOver } from './components/GameOver'
import { MainMenu } from './components/MainMenu'
import { MuteButton } from './components/MuteButton'
import { SettingsButton, SettingsPanel } from './components/SettingsPanel'

function AppContent() {
  const { screen } = useGame()

  switch (screen) {
    case 'menu':
      return <MainMenu />
    case 'about':
      return <AboutScreen />
    case 'alert':
      return <CrimeAlert />
    case 'game':
      return <CityView />
    case 'over':
      return <GameOver />
    default:
      return <MainMenu />
  }
}

export default function App() {
  return (
    <SettingsProvider>
      <AudioProvider>
        <GameProvider>
          <div className="app-shell">
            <div className="app-audio-controls">
              <SettingsButton />
              <MuteButton />
            </div>
            <SettingsPanel />
            <AudioController />
            <AppContent />
          </div>
        </GameProvider>
      </AudioProvider>
    </SettingsProvider>
  )
}
