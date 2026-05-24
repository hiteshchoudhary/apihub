import Loader from '@/components/shared/Loader';
import { Suspense, useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const isAuthenticated = false;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1279);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);


  return (
    <>
      {
        isAuthenticated ? (
          <Navigate to="/" />
        ) : (
          <>
            <div className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat bg-black'>
              {/* Conditionally render Spline only for non-mobile devices */}
              {!isMobile && (
                <Suspense fallback={<Loader />}>
                  <img
                    className='h-full w-full object-cover'
                    src="abstract-image.webp"
                    alt=""
                  />
                </Suspense>
              )}
            </div>
            <section className='flex flex-1 justify-center items-center flex-col py-10'>
              <Outlet />
            </section>
          </>
        )
      }
    </>
  )
}

export default AuthLayout