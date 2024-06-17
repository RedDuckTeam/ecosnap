import { Suspense, memo } from "react";
import Providers from "../providers/Providers";
import { PageLoader } from "../components/page-loader/page-loader";
import { Outlet } from "react-router-dom";

const DefaultLayout = memo(() => {
  return (
    <Providers>

         
              <div className="min-h-screen flex flex-col">
                {/* <Header /> */}
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
                {/* <Footer /> */}
              </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
