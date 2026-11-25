import React from 'react';

export function HomeScreen({ features, onOpenFeature, pwa }) {
  return (
    <div className="home-screen">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            ♪
          </div>
          <div>
            <h1>Scale Studio</h1>
            <p className="subtitle">
              Beginner-friendly music theory tools — choose a tool below to get started.
            </p>
          </div>
        </div>

        <div className="status-controls">
          {pwa?.isInstalled ? (
            <button
              type="button"
              className="status-pill connected pwa-sync-btn"
              onClick={pwa.checkUpdateNow}
              title="Installed app auto-updates whenever a new version is published"
            >
              ✓ Installed · Auto-Update On
            </button>
          ) : pwa?.canInstall ? (
            <button type="button" className="btn btn-accent" onClick={pwa.promptInstall}>
              📲 Install App on Phone
            </button>
          ) : (
            <span
              className="status-pill"
              title="Open over HTTPS on mobile to install to your home screen with auto-updates"
            >
              Mobile App Ready (PWA)
            </span>
          )}
        </div>
      </header>

      {pwa?.updatingBanner && (
        <div className="pwa-update-banner" role="status">
          Updating to the latest version…
        </div>
      )}

      {pwa?.showIosGuide && !pwa.isInstalled && (
        <div className="pwa-ios-guide" role="dialog" aria-label="Install on iPhone or iPad">
          <div>
            <strong>Install on iPhone / iPad:</strong> Tap the <strong>Share</strong> icon in Safari
            and choose <strong>Add to Home Screen</strong>. Updates sync automatically when opened.
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => pwa.setShowIosGuide(false)}
          >
            Got it
          </button>
        </div>
      )}

      <section className="home-hero">
        <span className="empty-badge">Workspace</span>
        <h2 className="home-title">Choose a Feature</h2>
        <p className="home-subtitle">
          Select a tool card to launch it. More music practice and discovery features will appear
          here as we add them.
        </p>

        <div className="feature-grid">
          {features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              className="feature-card"
              onClick={() => onOpenFeature(feature.id)}
            >
              <div className="feature-card-top">
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <span className="feature-role-badge">{feature.role}</span>
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
              <span className="feature-card-cta">
                {feature.cta} <span aria-hidden="true">→</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
