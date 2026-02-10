function App() {
  return (
    <div className="app">
      <h1 className="app-title">Hello World</h1>
    </div>
  );
}

function App2() {
  return (
    <div className="app">
      <h1 className="app-title">Hello World</h1>
      <p className="app-desc">SCSS 已整合，樣式由 style.css 提供。</p>
      <div className="app-actions">
        <button type="button" className="btn-primary">主要按鈕</button>
        <button type="button" className="btn-secondary">次要按鈕</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
