import { signupValidarion } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"
import BigLoader from "@/components/shared/BigLoader"

const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading } = useUserContext()
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();

  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signupValidarion>>({
    resolver: zodResolver(signupValidarion),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })



  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupValidarion>) {
    const newUser = await createUserAccount(values)
    if (!newUser) {
      return toast({
        title: "sign up faild. please try again",
        description: "Friday, February 10, 2023 at 5:57 PM",
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: 'sign in faild. please try again.' })
    }

    const isLogedin = await checkAuthUser();
    if (isLogedin) {
      form.reset();
      navigate('/');
      toast({ title: 'Welcome to the community' })
    } else {
      return toast({ title: 'sign in faild. please try again.' })
    }
  }


  return (
    <Form {...form}>
      {
        isLoading ? (
          <BigLoader />
        ) :
          (
            <div className="sm:w-420 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold">Sign up</h2>
              <h3 className="font-bold py-3">Create new account</h3>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-col  w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} className="shad-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} className="shad-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} className="shad-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter password" {...field} className="shad-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="shad-button_primary w-full">
                  {
                    isCreatingUser ? (
                      <div className="flex center gap-2 justify-center items-center">
                        <Loader />
                        loading...
                      </div>
                    ) : (
                      <div className="flex center gap-2">
                        Sign up
                      </div>
                    )}
                </Button>
                <p className="text-small-regular text-light-2 text-center mt-2">
                  Allready have an account ?
                  <Link to="/sign-in" className="text-primary-500 ml-2">Login</Link>
                </p>
              </form>
            </div>
          )
      }
    </Form>
  )
}

export default SignupForm