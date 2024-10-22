import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { Button } from "../ui/button"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FollowBtn = () => {
   const navigate = useNavigate();
   const { mutate: signOut, isSuccess, } = useSignOutAccount();
   useEffect(() => {
      if (isSuccess) {
         navigate('/sign-in');
         toast({ title: 'Logged out successfully' });
      }
   }, [isSuccess, navigate]);
   return (
      <Button
         variant={"ghost"}
         className="shad-button_ghost gap-2 flex items-center justify-start w-fit"
         onClick={() => signOut()}
      >
         <img
            src="/assets/icons/logout.svg"
            alt=""
            width={35}
            height={35}
         />
      </Button>
   )
}

export default FollowBtn