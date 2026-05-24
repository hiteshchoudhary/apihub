import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { Models } from "appwrite"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { postValidation } from "@/lib/validation"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "../ui/textarea"
import { Input } from "@/components/ui/input"
import FileUploader from "../shared/FileUploader"
import { useUserContext } from "@/context/AuthContext"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutation"
import Loader from "../shared/Loader"

type PostFormProps = {
   post?: Models.Document;
   action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
   const navigate = useNavigate();
   const { user } = useUserContext();

   // 1. Define your form.
   const form = useForm<z.infer<typeof postValidation>>({
      resolver: zodResolver(postValidation),
      defaultValues: {
         caption: post ? post?.caption : "",
         file: post ? post?.file : "",
         location: post ? post?.location : "",
         tags: post ? post.tags.join(',') : ""
      },
   });

   // query hooks
   const { mutateAsync: createPost, isPending: IsLoadingCreate } = useCreatePost();
   const { mutateAsync: updatePost, isPending: IsLoadingUpdate } = useUpdatePost();

   const handleSubmit = async (value: z.infer<typeof postValidation>) => {
      if (post && action == "Update") {
         const updatedPost = await updatePost({
            ...value,
            postId: post.$id,
            imageId: post?.imageId,
            imageUrl: post?.imageUrl,
         });
         // console.log("updated post :", updatedPost);
         if (!updatedPost) {
            toast({
               title: `${action} failed. Please try again.`,
            });
         }
         navigate(`/post/${post.$id}`);
         return;
      }

      const newPost = await createPost({
         ...value,
         userId: user.id,
      });

      if (!newPost) {
         toast({ title: "Please try again" });
      }
      navigate('/');
   };

   return (
      <Form {...form}>
         {
            IsLoadingCreate || IsLoadingUpdate ? (
               <Loader />
            ) : (
               <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-9 w-full max-w-5xl">
                  <FormField
                     control={form.control}
                     name="caption"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="shad-form_lable">Caption</FormLabel>
                           <FormControl>
                              <Textarea {...field}
                                 className="shad-textarea custom-scrollbar shad-input"
                                 placeholder="Write captions" />
                           </FormControl>
                           <FormMessage className="shad-form_message" />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="file"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="shad-form_lable">Add Photos</FormLabel>
                           <FormControl>
                              <FileUploader
                                 fieldChnage={field.onChange}
                                 mediaUrl={post?.imageUrl}
                              />
                           </FormControl>
                           <FormMessage className="shad-form_message" />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="location"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="shad-form_lable">Enter Location</FormLabel>
                           <FormControl>
                              <Input {...field} type="text" className="shad-input" placeholder="Enter Your location" />
                           </FormControl>
                           <FormMessage className="shad-form_message" />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="tags"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="shad-form_lable">Add tags (separated by comma , )</FormLabel>
                           <FormControl>
                              <Input {...field}
                                 type="text"
                                 className="shad-input"
                                 placeholder="Tech, Nature, Fashion" />
                           </FormControl>
                           <FormMessage className="shad-form_message" />
                        </FormItem>
                     )}
                  />
                  <div className="w-full flex flex-col gap-5 md:items-center md:justify-end md:flex-row">
                     <Button
                        onClick={() => { navigate('/') }}
                        type="button"
                        className="shad-button_dark_4">
                        Cancel
                     </Button>
                     <Button
                        disabled={IsLoadingCreate || IsLoadingUpdate}
                        type="submit"
                        className="shad-button_primary whitespace no-wrap">
                           {IsLoadingCreate || IsLoadingUpdate && <Loader />}
                           {action} post
                     </Button>
                  </div>
               </form>
            )
         }

      </Form>
   );
};

export default PostForm;
