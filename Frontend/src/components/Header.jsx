export function Header({ theme, toggleTheme }) {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="logo-dot" />
        <span className="brand-name">CodeReview AI</span>
      </div>
      <div className="nav-actions">
        <button
          type="button"
          className="mode-toggle"
          onClick={toggleTheme}
          aria-label="Toggle color mode"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  )
}
