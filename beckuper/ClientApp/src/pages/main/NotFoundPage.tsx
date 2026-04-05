import { Link } from "react-router";
import { ROUTES } from "../../constants/routing";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-1">
      <p className="text-6xl font-bold mb-0">404</p>
      <p className="text-2xl font-semibold mt-0 mb-3">page not found</p>
      <Link className="text-text-on-accent bg-accent px-3 py-1.5 rounded-lg" to={ROUTES.home}>Go to home</Link>
    </div>
  )
}

