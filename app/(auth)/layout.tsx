import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";


const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() }); 

  if (session?.user) redirect('/');
  
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/icons/logo.svg"
            width={140}
            height={32}
            alt="signalist logo"
            className="h-8 w-auto"
          />
        </Link>
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg-mb:16">
          <blockquote>
            Signalist changed my watchlist in to a winning list. The alets are
            timely and accurate. And I feel more confident in my trades.
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">- Pranshu Raj</cite>

              <p className="max-md:text:xs text-gray-500">Retail Investor</p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src="/assets/icons/star.svg"
                  width={16}
                  height={16}
                  alt="star"
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image src="/assets/images/dashboard.png" alt="dashboard preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
        </div>
      </section>
    </main>
  );
};

export default layout;
