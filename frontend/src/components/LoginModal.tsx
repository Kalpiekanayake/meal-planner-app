import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, X, LogIn, UserPlus } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 opacity-50"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Lock size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Sign in Required</h2>
            <p className="text-slate-500 font-medium">
              You need to be signed in to save meals, plan your week, or manage your shopping list.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-4 bg-primary-500 text-white font-black rounded-2xl shadow-lg shadow-primary-100 hover:bg-primary-600 transition-all active:scale-95"
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-all"
            >
              <UserPlus size={20} />
              <span>Create Account</span>
            </Link>
          </div>
          
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4">
            Joining is free and takes 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
