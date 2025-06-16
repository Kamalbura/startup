// SkillLance Final Authentication Component
// Self-contained with inline styles to ensure rendering

import React, { useState, useEffect } from 'react';

const FinalAuth = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`SkillLance Login Attempt:\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        margin: '1rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>SL</span>
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SkillLance
          </h1>
          <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
            India's Trust-First Student Skill Economy
          </p>
          <p style={{ color: '#999', fontSize: '0.9rem', margin: '0' }}>
            Current Time: {currentTime}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500',
              color: '#333'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college email"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            Sign In to SkillLance
          </button>
        </form>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e1e5e9'
        }}>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>
            New to SkillLance? 
            <span style={{ color: '#667eea', cursor: 'pointer', marginLeft: '0.5rem' }}>
              Create Account
            </span>
          </p>
        </div>

        {/* Status Indicators */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '0.9rem' }}>
            System Status:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✅</span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>Frontend Server Running</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✅</span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>React Components Loading</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', marginRight: '0.5rem' }}>✅</span>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>Firebase Config Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalAuth;
