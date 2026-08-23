import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Layout = lazy(() => import("./components/Layout").then((module) => ({ default: module.Layout })));
const AdminLayout = lazy(() => import("./components/AdminLayout").then((module) => ({ default: module.AdminLayout })));
const About = lazy(() => import("./pages/About").then((module) => ({ default: module.About })));
const AdminBlogEditor = lazy(() => import("./pages/AdminBlogEditor").then((module) => ({ default: module.AdminBlogEditor })));
const AdminBlogs = lazy(() => import("./pages/AdminBlogs").then((module) => ({ default: module.AdminBlogs })));
const AdminBlogView = lazy(() => import("./pages/AdminBlogView").then((module) => ({ default: module.AdminBlogView })));
const AdminCaseStudyEditor = lazy(() => import("./pages/AdminCaseStudyEditor").then((module) => ({ default: module.AdminCaseStudyEditor })));
const AdminCaseStudyList = lazy(() => import("./pages/AdminCaseStudyList").then((module) => ({ default: module.AdminCaseStudyList })));
const AdminCaseStudyView = lazy(() => import("./pages/AdminCaseStudyView").then((module) => ({ default: module.AdminCaseStudyView })));
const AdminContacts = lazy(() => import("./pages/AdminContacts").then((module) => ({ default: module.AdminContacts })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then((module) => ({ default: module.AdminDashboard })));
const AdminLogin = lazy(() => import("./pages/AdminLogin").then((module) => ({ default: module.AdminLogin })));
const BookSpeaking = lazy(() => import("./pages/BookSpeaking").then((module) => ({ default: module.BookSpeaking })));
const CaseStudies = lazy(() => import("./pages/CaseStudies").then((module) => ({ default: module.CaseStudies })));
const Contact = lazy(() => import("./pages/Contact").then((module) => ({ default: module.Contact })));
const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const NotFound = lazy(() => import("./pages/NotFound").then((module) => ({ default: module.NotFound })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then((module) => ({ default: module.PrivacyPolicy })));
const Resources = lazy(() => import("./pages/Resources").then((module) => ({ default: module.Resources })));
const ResourceArticle = lazy(() => import("./pages/ResourceArticle").then((module) => ({ default: module.ResourceArticle })));
const ServicePage = lazy(() => import("./pages/ServicePage").then((module) => ({ default: module.ServicePage })));
const ServicesOverview = lazy(() => import("./pages/ServicesOverview").then((module) => ({ default: module.ServicesOverview })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then((module) => ({ default: module.TermsOfService })));
const Testimonials = lazy(() => import("./pages/Testimonials").then((module) => ({ default: module.Testimonials })));

function PageLoader() {
  return <div className="grid min-h-[45vh] place-items-center bg-rysen-soft text-sm font-semibold text-rysen-charcoal/60">Loading…</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="resources" element={<AdminBlogs />} />
          <Route path="resources/new" element={<AdminBlogEditor />} />
          <Route path="resources/:id/edit" element={<AdminBlogEditor />} />
          <Route path="resources/:id/view" element={<AdminBlogView />} />
          <Route path="case-studies" element={<AdminCaseStudyList />} />
          <Route path="case-studies/new" element={<AdminCaseStudyEditor />} />
          <Route path="case-studies/:id/edit" element={<AdminCaseStudyEditor />} />
          <Route path="case-studies/:id/view" element={<AdminCaseStudyView />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesOverview />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/book-speaking" element={<BookSpeaking />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourceArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
