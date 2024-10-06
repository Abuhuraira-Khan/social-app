import React, { useState } from 'react';
import { apiUrl,useAuth } from './context/Context';
import {useNavigate} from 'react-router-dom'

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signUp');

  const navigate = useNavigate();
  const [authUser,setAuthUser] = useAuth();

  const [signForm, setSignForm] = useState({
    fullName: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setSignForm({
      ...signForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeL = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async () => {
    if (signForm.password !== signForm.confirmPassword) {
      alert('Passwords do not match');
    } else {
      try {
        const res = await fetch(`${apiUrl}/user/sign-up`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signForm),
        });
        const data = await res.json();

        if (res.ok) {
          alert(data.message);
          localStorage.setItem('User', JSON.stringify(data.data));
          setAuthUser(data.data);
          navigate('/');
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        localStorage.setItem('User', JSON.stringify(data.data));
        setAuthUser(data.data);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen max-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* Tabs for Sign Up / Login */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between">
          <button
            onClick={() => setActiveTab('signUp')}
            className={`w-1/2 py-2 text-xl font-semibold transition duration-300 ${
              activeTab === 'signUp' ? 'text-white bg-blue-500' : 'text-blue-500 bg-transparent'
            } rounded-lg focus:outline-none`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`w-1/2 py-2 text-xl font-semibold transition duration-300 ${
              activeTab === 'login' ? 'text-white bg-blue-500' : 'text-blue-500 bg-transparent'
            } rounded-lg focus:outline-none`}
          >
            Login
          </button>
        </div>

        {/* Sign Up Form */}
        {activeTab === 'signUp' && (
          <div className="mt-6 space-y-4 space-y-4 max-h-screen max-w-full transition-opacity duration-500">
            <h2 className="text-2xl font-bold text-center">Create an Account</h2>
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                onChange={handleChange}
                type="text"
                name="fullName"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                onChange={handleChange}
                type="text"
                name="userName"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                onChange={handleChange}
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSignUp}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="mt-6 space-y-4 max-h-screen max-w-full transition-opacity duration-500">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                onChange={handleChangeL}
                name="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                onChange={handleChangeL}
                name="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
