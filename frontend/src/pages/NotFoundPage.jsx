import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="mx-auto max-w-xl panel p-8 text-center">
    <span className="pill">404</span>
    <h1 className="section-title mt-3">That page went missing</h1>
    <p className="mt-3 text-slate-600">The Quick Market route you requested does not exist.</p>
    <Link to="/" className="button-primary mt-6">
      Back to home
    </Link>
  </section>
);

export default NotFoundPage;
