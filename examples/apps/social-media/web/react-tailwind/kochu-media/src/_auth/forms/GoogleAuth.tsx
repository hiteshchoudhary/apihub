// import { AuthWithGoogle } from "@/lib/appwrite/api";
// import { Button } from "../../components/ui/button";
// import { toast } from "@/hooks/use-toast";
// import { useNavigate } from "react-router-dom";

// const GoogleAuth = () => {
//    const navigate = useNavigate();

//    async function handleLoginGoogle() {
//       try {
//          const user = await AuthWithGoogle();
//          if (user === null || user === undefined) {
//             console.error("Google login failed");
//             return;
//          }
//       } catch (error) {
//          toast({ title: "Google login failed" });
//          navigate("/sign-up");
//          console.error("Error during Google login:", error);
//       }
//    }

//    return (
//       <>
//          <Button
//             onClick={handleLoginGoogle}
//             className="Google-auth_btn w-full"
//          >
//             Continue with Google
//          </Button>
//       </>
//    );
// };

// export default GoogleAuth;
