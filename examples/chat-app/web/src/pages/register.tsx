import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { register } = useAuth();

  const handleDataChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({
        ...data,
        [name]: e.target.value,
      });
    };

  const handleRegister = async () => await register(data);

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <h1 className="text-3xl font-bold">FreeAPI Chat App</h1>
      <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Register
        </h1>
        <Input
          placeholder="Enter the username..."
          value={data.username}
          onChange={handleDataChange("username")}
        />
        <Input
          placeholder="Enter the password..."
          type="password"
          value={data.password}
          onChange={handleDataChange("password")}
        />
        <Input
          placeholder="Enter the email..."
          type="email"
          value={data.email}
          onChange={handleDataChange("email")}
        />
        <Button
          fullWidth
          disabled={Object.values(data).some((val) => !val)}
          onClick={handleRegister}
        >
          Register
        </Button>
        <small className="text-zinc-300">
          Already have an account?{" "}
          <a className="text-primary hover:underline" href="/login">
            Login
          </a>
        </small>
      </div>
    </div>
  );
};

export default Register;
