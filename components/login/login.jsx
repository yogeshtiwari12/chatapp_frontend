import React, { useState } from 'react';
import { url } from '../../url';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('yogesh@gmail.com');
  const [password, setPassword] = useState('12345678');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${url}/userroute12/login`,
        { email, password },
        { withCredentials: true } 
      );
      console.log("proofile",response.data);  

      if (response.status) {
       alert(response.data.message);
        
        setEmail('');
        setPassword('');
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate('/')
    } catch (err) {

 
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-blue-700 font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;