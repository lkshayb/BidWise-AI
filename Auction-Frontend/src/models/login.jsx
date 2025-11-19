export default function LoginPromptModal({ open, onClose, onLogin }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-5 hover:text-gray-400 text-3xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-gray-700 mb-7">
          You need to login to access this feature
        </h2>
        <button
          onClick={onLogin}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold w-full"
        >
          Login with mail
        </button>
      </div>
    </div>
  );
}