import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ onSuccess, onError, isLoading }) => {
  return (
    <div className="w-full">
      <button
        type="button"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Đăng nhập với Google"
        onClick={() => document.querySelector('div[role="button"][tabindex="0"]')?.click()}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
        ) : (
          <>
            <FcGoogle className="w-5 h-5 text-gray-600" />
            <span>Đăng nhập với Google</span>
          </>
        )}
      </button>

      <div className="hidden">
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
      </div>
    </div>
  );
};

export default GoogleLoginButton;