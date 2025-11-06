import React, { useState } from 'react';
import { userAPI } from '../services/api';
import { useUser } from '../contexts/UserContext';
import classes from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await userAPI.login(email);
      login(response.data);
      setError('');
    } catch (error) {
      setError('User not found. Please register first.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, phone, role };
      const response = await userAPI.register(userData);
      login(response.data);
      setError('');
    } catch (error) {
      setError('Registration failed. Email might already exist.');
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.heroSection}>
        <div className={classes.heroContent}>
          <h1 className={classes.heroTitle}>🍽️ FoodHub</h1>
          <p className={classes.heroSubtitle}>Delicious food delivered to your doorstep</p>
          <div className={classes.heroEmojis}>🍕 🍔 🍜 🍱 🌮 🍰</div>
        </div>
      </div>
      
      <div className={classes.loginForm}>
        <div className={classes.formHeader}>
          <h2>{isRegistering ? '🚀 Join FoodHub' : '👋 Welcome Back'}</h2>
          <p>{isRegistering ? 'Create your account to start ordering' : 'Sign in to continue your food journey'}</p>
        </div>
        
        {error && <div className={classes.error}>⚠️ {error}</div>}
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <>
              <div className={classes.inputGroup}>
                <span className={classes.inputIcon}>👤</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={classes.inputGroup}>
                <span className={classes.inputIcon}>📱</span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className={classes.inputGroup}>
                <span className={classes.inputIcon}>🏷️</span>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">🛒 Customer</option>
                  <option value="restaurant">🏪 Restaurant Owner</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
            </>
          )}
          
          <div className={classes.inputGroup}>
            <span className={classes.inputIcon}>✉️</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={classes.submitButton}>
            {isRegistering ? '🚀 Create Account' : '🍽️ Enter FoodHub'}
          </button>
        </form>
        
        <p>
          {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            className={classes.switchButton}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;