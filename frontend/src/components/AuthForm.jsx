import React, { useState } from 'react';

const AuthPage = () => {

  const [signForm, setSignForm] = useState({
    fullName:'',
    email: '',
    userName:'',
    password: '',
    confirmPassword: '',
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })



  const handleChange = (e)=>{
    setSignForm({
      ...signForm,
      [e.target.name]: e.target.value,
      })
  }

  const handleChangeL = (e)=>{
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
      })
  }

  const handleSignUp = async ()=>{
    if(signForm.password !== signForm.confirmPassword){
      alert('Passwords do not match')
    }
    else{
      try {
        const res = await fetch(`http://localhost:4400/user/sign-up`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(signForm),
        });
        const data = await res.json();
        console.log(data);
  
        if(res.ok){
          alert(data.message)
          localStorage.setItem('User',JSON.stringify(data.data))
        }else{
          alert(data.message)
        }
      } catch (error) {
  
        console.log(error)
      }
    }

  }

  // login
  const handleLogin = async ()=>{
    try {
      const res = await fetch(`http://localhost:4400/user/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginForm),
      })

      const data = await res.json();
      console.log(data);

      if(res.ok){
        alert(data.message)
        localStorage.setItem('User',JSON.stringify(data.data))
      }
      else{
        alert(data.message)
      }
    } catch (error) {
      
    }
  }


  return (
    <div className="flex flex-col justify-center items-center mt-40 h-screen bg-red-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
            onChange={handleChange}
              type="text"
              name='fullName'
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
            onChange={handleChange}
              type="email"
              name='email'
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User Name</label>
            <input
            onChange={handleChange}
              type="text"
              name='userName'
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
            onChange={handleChange}
              type="password"
              name='password'
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
            onChange={handleChange}
              type="password"
              name='confirmPassword'
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
            onClick={handleSignUp}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
            onChange={handleChangeL}
              name='email'
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
            onChange={handleChangeL}
              name='password'
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
            onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
      </div>
    </div>
  );
};

export default AuthPage;
