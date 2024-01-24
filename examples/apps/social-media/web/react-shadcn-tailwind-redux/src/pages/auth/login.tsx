import { loginApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { login } from "@/redux/slices/authSlice";
import { LocalStorage, requestHandler } from "@/utils";
import { EyeIcon, EyeOff, Lock, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();

  // login handler to make api call
  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validating password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
    }

    // making api call and dispatching data on success
    await requestHandler(
      async () => await loginApi(email, password),
      setLoading,
      (res) => {
        LocalStorage.set("user", res.data.user);
        LocalStorage.set("token", res.data.accessToken);
        dispatch(login({ user: res.data.user, token: res.data.accessToken }));
      },
      (error) => {
        toast.error(error);
      }
    );
  };

  return (
    <>
      <div className="bg-card h-[calc(100vh-70px)]">
        <div className="pt-20  flex flex-col max-w-[600px] mx-auto items-center">
          <h2 className="text-2xl sm:text-3xl my-5">Login to ApiGram</h2>
          <Separator className="w-[20%] mx-auto font-mono  bg-accent/55" />

          <form
            onSubmit={handleLoginSubmit}
            className="mt-10 w-full px-6 py-6 flex flex-col gap-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className=" text-muted-foreground absolute top-[15px] left-3" />
                <Input
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  placeholder="Enter your Email.."
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
                  disabled={loading}
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute cursor-pointer right-2 top-[15px]"
                  />
                ) : (
                  <EyeIcon
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute cursor-pointer right-2 top-[15px]"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link to={"/forgot-password"} className="text-primary/65">
                Forgot password ?
              </Link>

              <Button
                disabled={loading}
                size={"lg"}
                type="submit"
                className="rounded-xl"
              >
                Login
              </Button>
            </div>
          </form>
          <div className="w-full p-6">
            <div className="w-full flex items-center gap-3">
              <div className="border-[1px] border-foreground/ w-full h-0" />
              <p>or</p>
              <div className="border-[1px] border-foreground/ w-full h-0" />
              <div />
            </div>

            <div>
              <Link to={"/register"}>
                Don't have an account ?{" "}
                <span className="text-primary">Create one</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
