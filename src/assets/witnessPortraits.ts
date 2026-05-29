import type { SiteScene } from '../game/types'

export function getWitnessPortraitUrl(scene: SiteScene): string {
  return `/images/witnesses/${scene}.jpg`
}

export function getSceneImageUrl(scene: SiteScene): string {
  return `/images/scenes/${scene}.jpg`
}
