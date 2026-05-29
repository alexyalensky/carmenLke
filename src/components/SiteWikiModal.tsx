import { FlagImage } from './FlagImage'
import type { SiteWikiInfo } from '../data/siteWiki'

interface SiteWikiModalProps {
  site: SiteWikiInfo
  onClose: () => void
}

export function SiteWikiModal({ site, onClose }: SiteWikiModalProps) {
  return (
    <div className="deluxe-modal-overlay site-wiki-overlay" onClick={onClose}>
      <div
        className="deluxe-modal site-wiki-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="site-wiki-title"
        aria-modal="true"
      >
        <header className="modal-header site-wiki-header">
          <div className="site-wiki-title-row">
            <FlagImage countryId={site.countryId} width={28} />
            <div>
              <h2 id="site-wiki-title">{site.name}</h2>
              <p className="site-wiki-subtitle">
                {site.nameEn} · {site.countryName}
              </p>
            </div>
          </div>
        </header>

        {site.image && (
          <div className="site-wiki-image-wrap">
            <img
              src={site.image}
              alt={site.name}
              className="site-wiki-image"
              loading="lazy"
            />
          </div>
        )}

        <p className="site-wiki-summary">{site.summary}</p>

        <button type="button" className="btn-secondary modal-close" onClick={onClose}>
          סגור
        </button>
      </div>
    </div>
  )
}
