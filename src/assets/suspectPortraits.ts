/** Bundled cartoon job-avatar portraits — cropped from Freepik/Vecteezy free assets */

export function getSuspectPortraitUrl(suspectId: string): string {
  return `/images/suspects/${suspectId}.jpg`
}

export const SUSPECT_PORTRAIT_ATTRIBUTION =
  'Suspect portraits include cartoon avatars by Freepik (freepik.com) and Vecteezy (vecteezy.com).'
