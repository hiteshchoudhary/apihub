import { Route, Routes } from 'react-router-dom'
import './globals.css'
// routes components
import SigninForm from './_auth/forms/SignInForm'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

import { Toaster } from "@/components/ui/toaster"
// all pages
import { AllUsers, Bookmarks, CreatePost, Explore, Home, PostDetails, Profile, Saved, UpdatePost, UpdateProfile, UserLiked, UserPosts, UserSaved } from './_root/pages'

function App() {
   return (
      <main className='flex h-screen'>
         <Routes>
            {/* public routes */}
            <Route element={<AuthLayout />} >
               <Route path="/sign-in" element={<SigninForm />} />
               <Route path="/sign-up" element={<SignupForm />} />
            </Route>
            {/* private routes */}
            <Route element={<RootLayout />}>
               <Route index element={<Home />} />
               <Route path='/bookmarks' element={<Bookmarks />} />
               <Route path='/explore' element={<Explore />} />
               <Route path='/all-users' element={<AllUsers />} />
               <Route path='/saved' element={<Saved />} />
               <Route path='/create-post' element={<CreatePost />} />
               <Route path='/update-post/:id' element={<UpdatePost />} />
               <Route path='/post/:id' element={<PostDetails />} />
               <Route path='/profile/:id/*' element={<Profile />} >
                  {/* Nested routes for posts, likes, and saves */}
                  <Route index element={<UserPosts />} />
                  <Route path='likes' element={<UserLiked />} />
                  <Route path='saves' element={<UserSaved />} />
               </Route>
               <Route path='/update-profile/:id/*' element={<UpdateProfile />} />
            </Route>
         </Routes>
         <Toaster />
      </main>
   )
}

export default App