import { registerApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { requestHandler } from "@/utils";
import { EyeIcon, EyeOff, Lock, Mail, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // running basic validation on the fields
  const validateForm = () => {
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (confirmPassword !== password) {
      toast.error("Password and Confirm Password does not match");
      return false;
    }

    return true;
  };

  // making api call for registration and redirecting to login page
  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidForm = validateForm();

    if (isValidForm) {
      await requestHandler(
        async () => await registerApi(email, password, username),
        setLoading,
        (res) => {
          toast.success(res.message);
          navigate("/login");
        },
        (error) => {
          toast.error(error);
        }
      );
    }
    return;
  };

  return (
    <div className="bg-card w-full h-[calc(100vh-80px)]">
      <div className="max-w-[600px] mx-auto flex flex-col pt-20 items-center">
        <h2 className="text-2xl sm:text-3xl my-5">Create your Account</h2>
        <Separator className="w-[20%] mx-auto font-mono  bg-accent/55" />

        <form
          onSubmit={handleRegisterSubmit}
          className="mt-10 w-full px-6 py-6 flex flex-col gap-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className=" text-muted-foreground absolute top-[15px] left-3" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                required={true}
                placeholder="Enter your Email.."
                className="px-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className=" text-muted-foreground absolute top-[15px] left-3" />
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                type="text"
                required={true}
                placeholder="create your unique username"
                className="px-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className=" text-muted-foreground absolute top-[15px] left-3" />
              <Input
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                id="password"
                required
                type={showPassword ? "text" : "password"}
                placeholder="Please enter your password"
                className="px-12"
              />
              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword((prev: boolean) => !prev)}
                  className="absolute cursor-pointer right-2 top-[15px]"
                />
              ) : (
                <EyeIcon
                  onClick={() => setShowPassword((prev: boolean) => !prev)}
                  className="absolute cursor-pointer right-2 top-[15px]"
                />
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className=" text-muted-foreground absolute top-[15px] left-3" />
              <Input
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                id="confirmPassword"
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="confirm your password"
                className="px-12"
              />
              {showConfirmPassword ? (
                <EyeOff
                  onClick={() =>
                    setShowConfirmPassword((prev: boolean) => !prev)
                  }
                  className="absolute cursor-pointer right-2 top-[15px]"
                />
              ) : (
                <EyeIcon
                  onClick={() =>
                    setShowConfirmPassword((prev: boolean) => !prev)
                  }
                  className="absolute cursor-pointer right-2 top-[15px]"
                />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link to={"/login"}>
              Already an account ?{" "}
              <span className="text-primary">Login Here</span>
            </Link>

            <Button type="submit" size={"lg"} className="rounded-xl">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
