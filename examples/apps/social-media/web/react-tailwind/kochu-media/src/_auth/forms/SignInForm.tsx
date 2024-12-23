import { signinValidarion } from "@/lib/validation"
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
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"
// import GoogleAuth from "./GoogleAuth"

const SignInForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof signinValidarion>>({
    resolver: zodResolver(signinValidarion),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinValidarion>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: 'Sign in failed. Please try again.' })
    }

    const isLoggedIn = await checkAuthUser()
    if (isLoggedIn) {
      form.reset()
      navigate('/')
      toast({ title: 'Welcome to the community!' })
    } else {
      return toast({ title: 'Sign in failed. Please try again.' })
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold">Sign in</h2>
        <h3 className="font-bold py-3">Login to your account</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-col w-full">
          {/* Email Field */}
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    className="shad-input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="shad-button_primary w-full">
            {isSigningIn ? (
              <div className="flex center gap-2 justify-center items-center">
                <Loader />
                Loading...
              </div>
            ) : (
              <div className="flex center gap-2">Sign in</div>
            )}
          </Button>
          {/* <GoogleAuth /> */}
          {/* Redirect to Signup */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don’t have an account?
            <Link to="/sign-up" className="text-primary-500 ml-2">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignInForm
