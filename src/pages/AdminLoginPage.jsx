import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/login/', { username, password });
      const { access, refresh, username: user, email, is_staff } = response.data;
      if (!is_staff) {
        setError('Access denied. Staff privileges required.');
        return;
      }
      login(access, refresh, { username: user, email });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="staff-login-page">
    <div className="staff-login-glow" aria-hidden="true" />
    <Link className="staff-login-back" to="/experience" aria-label="Back to website"><ArrowLeft/> <span>Back to website</span></Link>
    <section className="staff-login-card">
      <header>
        <img src="/benitha-logo-refined-transparent.png" alt="Benitha Makeup Pro" />
        <span><LockKeyhole/> Private staff area</span>
        <h1>Welcome Back</h1>
        <p>Sign in to manage bookings and studio services.</p>
      </header>

      {error && <div className="staff-login-error" role="alert"><AlertCircle/><span>{error}</span></div>}

      <form onSubmit={handleLoginSubmit}>
        <label><span>Username</span><div><User/><input type="text" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter staff username" /></div></label>
        <label><span>Password</span><div><LockKeyhole/><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff/> : <Eye/>}</button></div></label>
        <button className="staff-login-submit" type="submit" disabled={loading}>{loading ? <><Loader2 className="animate-spin"/> Signing in...</> : 'Sign in securely'}</button>
      </form>
      <footer><LockKeyhole/> Authorized Benitha Makeup Pro staff only</footer>
    </section>
  </main>;
}
