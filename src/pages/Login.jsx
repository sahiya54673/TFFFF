import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheckSquare, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      console.error('Login error details:', err);
      let errorMsg = 'Something went wrong. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          // If the server returns HTML or raw text (common for 404s/500s)
          errorMsg = err.response.data.length > 100 ? `${err.response.data.substring(0, 100)}...` : err.response.data;
        } else if (typeof err.response.data.message === 'string') {
          errorMsg = err.response.data.message;
        } else if (typeof err.response.data.error === 'string') {
          errorMsg = err.response.data.error;
        } else if (Array.isArray(err.response.data.errors)) {
          // Handle validation errors array
          errorMsg = err.response.data.errors.map(e => e.msg || e.message || 'Validation error').join(', ');
        } else if (err.response.status) {
          errorMsg = `Server Error (${err.response.status}): ${err.response.statusText}`;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow glow-1"></div>
      <div className="login-glow glow-2"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <FiCheckSquare />
          </div>
          <h1>TaskFlow</h1>
          <p>{isRegister ? 'Create your account' : 'Welcome back'}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            className="btn-toggle"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
