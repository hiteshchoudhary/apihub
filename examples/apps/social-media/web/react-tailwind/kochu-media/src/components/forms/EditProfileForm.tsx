import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FileUploader from "../shared/FileUploader"
import { useUserContext } from "@/context/AuthContext"
import { useUpdateProfile } from "@/lib/react-query/queriesAndMutation" // This would be your profile update mutation
import Loader from "../shared/Loader"
import { updateUserValidation } from "@/lib/validation"
import { IUserWithImageId } from "@/types"

const EditProfileForm = () => {
   const navigate = useNavigate();
   const { user } = useUserContext();
   const userWithImageId = user as IUserWithImageId;
   // 1. Define your form.
   const form = useForm<z.infer<typeof updateUserValidation>>({
      resolver: zodResolver(updateUserValidation),
      defaultValues: {
         name: userWithImageId?.name || "",
         bio: userWithImageId?.bio || "",
      },
   });

   // mutation hook for profile update
   const { mutateAsync: updateProfile, isPending: IsLoadingUpdate } = useUpdateProfile();

   const handleSubmit = async (value: z.infer<typeof updateUserValidation>) => {
      const updatedProfile = await updateProfile({
         ...value,
         file: value.file,
         userId: userWithImageId.id,
         imageId: userWithImageId.imageId, 
         imageUrl: userWithImageId.imageUrl,
      });

      if (!updatedProfile) {
         toast({ title: "Profile update failed. Please try again." });
         return;
      }

      toast({ title: "Profile updated successfully!" });
      navigate(`/profile/${user.id}`);
   };

   return (
      <Form {...form}>
         {IsLoadingUpdate ? (
            <Loader />
         ) : (
            <form
               onSubmit={form.handleSubmit(handleSubmit)}
               className="flex flex-col gap-9 w-full max-w-5xl">
               {/* Profile Image Uploader */}
               <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="shad-form_lable">Profile Image</FormLabel>
                        <FormControl>
                           <FileUploader
                              fieldChnage={(file) => field.onChange(file)}
                              mediaUrl={user?.imageUrl}
                           />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                     </FormItem>
                  )}
               />

               {/* Name Input */}
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="shad-form_lable">Name</FormLabel>
                        <FormControl>
                           <Input {...field} type="text" className="shad-input" placeholder="Enter your name" />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                     </FormItem>
                  )}
               />

               {/* Bio Input */}
               <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="shad-form_lable">Bio</FormLabel>
                        <FormControl>
                           <Input {...field} type="text" className="shad-input" placeholder="Write your bio" />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                     </FormItem>
                  )}
               />

               {/* Submit and Cancel Buttons */}
               <div className="w-full flex flex-col gap-5 md:items-center md:justify-end md:flex-row">
                  <Button
                     onClick={() => { navigate(`/profile/${user.id}`) }}
                     type="button"
                     className="shad-button_dark_4">
                     Cancel
                  </Button>
                  <Button
                     disabled={IsLoadingUpdate}
                     type="submit"
                     className="shad-button_primary whitespace no-wrap">
                     {IsLoadingUpdate && <Loader />}
                     Update Profile
                  </Button>
               </div>
            </form>
         )}
      </Form>
   );
};

export default EditProfileForm;
