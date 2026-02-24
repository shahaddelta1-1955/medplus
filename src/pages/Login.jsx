return (
  <div className="pharmacy-login-container">

    <div className="left-panel">
      <button className="back-btn">← Back to Home</button>

      <div className="welcome-box">
        <div className="logo-box">Med+</div>
        <h1>Welcome Back, Pharmacy</h1>
        <p>
          Log in to manage your stock and update
          real-time medicine availability.
        </p>
      </div>
    </div>

    <div className="right-panel">
      <h2>Pharmacy Login</h2>

      <p className="subtitle">
        Access your MedPlus dashboard and manage your store.
      </p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p className="register-text">
        Don't have an account? <span>Register here</span>
      </p>
    </div>

  </div>
);
