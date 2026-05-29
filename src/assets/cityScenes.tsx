import type { ReactElement } from 'react'
import { CGA, P, PixelArt } from './PixelArt'

type SceneProps = { size?: number; label?: string }

const cityScenes: Record<string, (props: SceneProps) => ReactElement> = {
  'tel-aviv': ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={10} w={16} h={6} c={CGA.sand} />
      <P x={0} y={8} w={16} h={2} c={CGA.brightCyan} />
      <P x={2} y={4} w={3} h={6} c={CGA.lightGray} />
      <P x={6} y={6} w={4} h={4} c={CGA.white} />
      <P x={11} y={3} w={3} h={7} c={CGA.lightGray} />
      <P x={7} y={5} w={2} h={2} c={CGA.yellow} />
    </PixelArt>
  ),
  paris: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.green} />
      <P x={7} y={1} w={2} h={11} c={CGA.brown} />
      <P x={5} y={3} w={6} h={1} c={CGA.brown} />
      <P x={4} y={4} w={8} h={1} c={CGA.brown} />
      <P x={3} y={5} w={10} h={1} c={CGA.brown} />
      <P x={6} y={0} w={4} h={2} c={CGA.red} />
      <P x={0} y={10} w={16} h={2} c={CGA.brightCyan} />
    </PixelArt>
  ),
  cairo: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={2} y={8} w={4} h={4} c={CGA.yellow} />
      <P x={10} y={6} w={4} h={6} c={CGA.yellow} />
      <P x={6} y={10} w={4} h={2} c={CGA.brown} />
      <P x={0} y={6} w={16} h={2} c={CGA.brightCyan} />
      <P x={13} y={2} w={2} h={2} c={CGA.yellow} />
    </PixelArt>
  ),
  tokyo: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={0} w={16} h={16} c={CGA.darkGray} />
      <P x={7} y={2} w={2} h={12} c={CGA.red} />
      <P x={5} y={4} w={6} h={1} c={CGA.white} />
      <P x={4} y={7} w={8} h={1} c={CGA.white} />
      <P x={3} y={10} w={10} h={1} c={CGA.white} />
      <P x={6} y={13} w={4} h={2} c={CGA.brightRed} />
    </PixelArt>
  ),
  'new-york': ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={14} w={16} h={2} c={CGA.darkGray} />
      <P x={1} y={4} w={2} h={10} c={CGA.lightGray} />
      <P x={4} y={2} w={2} h={12} c={CGA.white} />
      <P x={7} y={1} w={2} h={13} c={CGA.lightGray} />
      <P x={10} y={3} w={2} h={11} c={CGA.white} />
      <P x={13} y={5} w={2} h={9} c={CGA.lightGray} />
      <P x={0} y={8} w={16} h={1} c={CGA.yellow} />
    </PixelArt>
  ),
  berlin: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.green} />
      <P x={3} y={5} w={10} h={7} c={CGA.yellow} />
      <P x={5} y={3} w={6} h={2} c={CGA.yellow} />
      <P x={7} y={7} w={2} h={3} c={CGA.brightBlue} />
      <P x={0} y={10} w={16} h={1} c={CGA.lightGray} />
    </PixelArt>
  ),
  'buenos-aires': ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.green} />
      <P x={7} y={2} w={2} h={10} c={CGA.white} />
      <P x={5} y={4} w={6} h={1} c={CGA.white} />
      <P x={4} y={7} w={8} h={1} c={CGA.white} />
      <P x={6} y={0} w={4} h={2} c={CGA.brightCyan} />
      <P x={2} y={10} w={12} h={2} c={CGA.sand} />
    </PixelArt>
  ),
  sydney: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={10} w={16} h={6} c={CGA.brightCyan} />
      <P x={2} y={6} w={5} h={4} c={CGA.white} />
      <P x={9} y={6} w={5} h={4} c={CGA.white} />
      <P x={4} y={4} w={8} h={2} c={CGA.white} />
      <P x={6} y={2} w={4} h={2} c={CGA.white} />
      <P x={0} y={8} w={16} h={2} c={CGA.sand} />
    </PixelArt>
  ),
  mumbai: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={11} w={16} h={5} c={CGA.sand} />
      <P x={6} y={1} w={4} h={10} c={CGA.white} />
      <P x={5} y={0} w={6} h={2} c={CGA.brightCyan} />
      <P x={4} y={3} w={1} h={8} c={CGA.gold} />
      <P x={11} y={3} w={1} h={8} c={CGA.gold} />
      <P x={1} y={8} w={14} h={3} c={CGA.brown} />
    </PixelArt>
  ),
  london: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.green} />
      <P x={6} y={2} w={4} h={10} c={CGA.brown} />
      <P x={5} y={1} w={6} h={2} c={CGA.red} />
      <P x={7} y={4} w={2} h={2} c={CGA.white} />
      <P x={2} y={10} w={12} h={2} c={CGA.brightCyan} />
      <P x={12} y={5} w={3} h={7} c={CGA.lightGray} />
    </PixelArt>
  ),
  rio: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={10} w={16} h={6} c={CGA.brightCyan} />
      <P x={0} y={4} w={16} h={6} c={CGA.green} />
      <P x={7} y={1} w={2} h={3} c={CGA.lightGray} />
      <P x={6} y={0} w={4} h={1} c={CGA.lightGray} />
      <P x={5} y={3} w={6} h={1} c={CGA.lightGray} />
      <P x={2} y={8} w={12} h={2} c={CGA.sand} />
    </PixelArt>
  ),
  istanbul: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={5} y={3} w={6} h={9} c={CGA.brown} />
      <P x={4} y={1} w={8} h={3} c={CGA.brown} />
      <P x={7} y={0} w={2} h={2} c={CGA.gold} />
      <P x={6} y={6} w={4} h={4} c={CGA.brightCyan} />
      <P x={0} y={10} w={16} h={2} c={CGA.brightBlue} />
    </PixelArt>
  ),
  rome: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={2} y={6} w={12} h={6} c={CGA.brown} />
      <P x={4} y={4} w={8} h={2} c={CGA.brown} />
      <P x={6} y={2} w={4} h={2} c={CGA.brown} />
      <P x={7} y={0} w={2} h={2} c={CGA.gold} />
      <P x={1} y={8} w={2} h={4} c={CGA.brown} />
      <P x={13} y={8} w={2} h={4} c={CGA.brown} />
    </PixelArt>
  ),
  madrid: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={11} w={16} h={5} c={CGA.sand} />
      <P x={6} y={2} w={4} h={9} c={CGA.red} />
      <P x={5} y={0} w={6} h={2} c={CGA.gold} />
      <P x={2} y={8} w={12} h={3} c={CGA.white} />
      <P x={0} y={10} w={16} h={1} c={CGA.green} />
    </PixelArt>
  ),
  moscow: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={13} w={16} h={3} c={CGA.white} />
      <P x={4} y={3} w={8} h={10} c={CGA.red} />
      <P x={3} y={1} w={10} h={2} c={CGA.gold} />
      <P x={7} y={0} w={2} h={1} c={CGA.gold} />
      <P x={6} y={5} w={4} h={3} c={CGA.yellow} />
      <P x={1} y={11} w={14} h={2} c={CGA.green} />
    </PixelArt>
  ),
  beijing: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={2} y={4} w={12} h={8} c={CGA.red} />
      <P x={4} y={2} w={8} h={2} c={CGA.gold} />
      <P x={6} y={6} w={4} h={4} c={CGA.yellow} />
      <P x={0} y={10} w={16} h={2} c={CGA.darkGray} />
    </PixelArt>
  ),
  bangkok: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={11} w={16} h={5} c={CGA.green} />
      <P x={5} y={2} w={6} h={9} c={CGA.gold} />
      <P x={4} y={0} w={8} h={2} c={CGA.brightRed} />
      <P x={7} y={4} w={2} h={5} c={CGA.yellow} />
      <P x={0} y={9} w={16} h={2} c={CGA.brightCyan} />
    </PixelArt>
  ),
  athens: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={2} y={7} w={12} h={5} c={CGA.white} />
      <P x={3} y={5} w={10} h={2} c={CGA.white} />
      <P x={4} y={3} w={8} h={2} c={CGA.white} />
      <P x={5} y={1} w={6} h={2} c={CGA.white} />
      <P x={1} y={6} w={1} h={6} c={CGA.brown} />
      <P x={14} y={6} w={1} h={6} c={CGA.brown} />
    </PixelArt>
  ),
  'mexico-city': ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={6} y={2} w={4} h={10} c={CGA.brown} />
      <P x={5} y={0} w={6} h={2} c={CGA.red} />
      <P x={2} y={8} w={12} h={4} c={CGA.green} />
      <P x={0} y={10} w={16} h={2} c={CGA.brightCyan} />
    </PixelArt>
  ),
  montreal: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={13} w={16} h={3} c={CGA.white} />
      <P x={5} y={3} w={6} h={10} c={CGA.lightGray} />
      <P x={4} y={1} w={8} h={2} c={CGA.brightBlue} />
      <P x={7} y={0} w={2} h={1} c={CGA.red} />
      <P x={1} y={11} w={14} h={2} c={CGA.brightCyan} />
    </PixelArt>
  ),
  amsterdam: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={10} w={16} h={6} c={CGA.brightBlue} />
      <P x={2} y={4} w={4} h={6} c={CGA.brown} />
      <P x={10} y={5} w={4} h={5} c={CGA.brown} />
      <P x={1} y={3} w={6} h={1} c={CGA.brown} />
      <P x={9} y={4} w={6} h={1} c={CGA.brown} />
      <P x={3} y={2} w={2} h={2} c={CGA.green} />
      <P x={11} y={3} w={2} h={2} c={CGA.green} />
    </PixelArt>
  ),
  johannesburg: ({ size, label }) => (
    <PixelArt size={size} label={label}>
      <P x={0} y={12} w={16} h={4} c={CGA.sand} />
      <P x={0} y={0} w={16} h={12} c={CGA.brightCyan} />
      <P x={3} y={6} w={10} h={6} c={CGA.brown} />
      <P x={5} y={4} w={6} h={2} c={CGA.brown} />
      <P x={7} y={2} w={2} h={2} c={CGA.gold} />
      <P x={1} y={10} w={14} h={2} c={CGA.green} />
    </PixelArt>
  ),
}

export function CityScene({ cityId, size = 120, label }: { cityId: string; size?: number; label?: string }) {
  const Scene = cityScenes[cityId]
  if (!Scene) {
    return (
      <PixelArt size={size} label={label}>
        <P x={0} y={8} w={16} h={8} c={CGA.green} />
        <P x={4} y={4} w={8} h={4} c={CGA.lightGray} />
        <P x={6} y={2} w={4} h={2} c={CGA.white} />
      </PixelArt>
    )
  }
  return <Scene size={size} label={label} />
}

const countryScenes: Record<string, (props: SceneProps) => ReactElement> = {
  israel: ({ size }) => (
    <PixelArt size={size}>
      <P x={0} y={0} w={16} h={16} c={CGA.white} />
      <P x={0} y={5} w={16} h={2} c={CGA.blue} />
      <P x={0} y={9} w={16} h={2} c={CGA.blue} />
      <P x={6} y={6} w={4} h={4} c={CGA.blue} />
    </PixelArt>
  ),
  france: ({ size }) => (
    <PixelArt size={size}>
      <P x={0} y={0} w={5} h={16} c={CGA.blue} />
      <P x={5} y={0} w={6} h={16} c={CGA.white} />
      <P x={11} y={0} w={5} h={16} c={CGA.red} />
    </PixelArt>
  ),
  japan: ({ size }) => (
    <PixelArt size={size}>
      <P x={0} y={0} w={16} h={16} c={CGA.white} />
      <P x={5} y={5} w={6} h={6} c={CGA.red} />
    </PixelArt>
  ),
  brazil: ({ size }) => (
    <PixelArt size={size}>
      <P x={0} y={0} w={16} h={16} c={CGA.green} />
      <P x={4} y={4} w={8} h={8} c={CGA.yellow} />
      <P x={6} y={6} w={4} h={4} c={CGA.brightBlue} />
    </PixelArt>
  ),
}

export function CountryFlag({ countryId, size = 48 }: { countryId: string; size?: number }) {
  const Scene = countryScenes[countryId]
  if (!Scene) {
    return (
      <PixelArt size={size}>
        <P x={0} y={0} w={16} h={16} c={CGA.brightBlue} />
        <P x={4} y={4} w={8} h={8} c={CGA.yellow} />
      </PixelArt>
    )
  }
  return <Scene size={size} />
}
