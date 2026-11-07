// Apply the saved palette before the stylesheet paints, including file:// previews.
(() => {
  let theme = 'dark';
  try { if (localStorage.getItem('mm-theme') === 'light') theme = 'light'; } catch (_) {}
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    function applyTheme() {
      const light = theme === 'light';
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      const label = `Switch to ${light ? 'dark' : 'light'} mode`;
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(light));
      button.title = label;
      button.querySelector('.theme-label').textContent = light ? 'DARK' : 'LIGHT';
      document.querySelector('meta[name="theme-color"]').content = light ? '#f6f7ef' : '#101312';
    }
    applyTheme();
    button.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      try { localStorage.setItem('mm-theme', theme); } catch (_) {}
    });
  });
})();
