import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';

function Navbar() {
  const user = useDispatch(state => state.user);
  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-8xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
       
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">ChatApp</span>
            </Link>
          </div>


          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Features
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex justify-end">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom Line with Gradient */}
      {/* <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div> */}
    </nav>
  );
}

export default Navbar;