import LoginForm from "@/component/Login/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          🔐 Đăng nhập quản trị
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
