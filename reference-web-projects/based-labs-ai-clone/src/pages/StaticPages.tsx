import { APP_NAME } from "@/constants/app";

function SimplePage({ title, content }: { title: string; content: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        <p>{content}</p>
        <p>{APP_NAME} is committed to providing the best AI generation platform. For questions, contact us at support@basedlabs.ai.</p>
      </div>
    </div>
  );
}

export function AboutPage() { return <SimplePage title="About" content={`${APP_NAME} is a creative AI platform that enables anyone to generate stunning images, videos, and audio using the latest AI models. We bring together the best models in one platform.`} />; }
export function BlogPage() { return <SimplePage title="Blog" content="Stay up to date with the latest from our team, product updates, and community highlights." />; }
export function CareersPage() { return <SimplePage title="Careers" content="We're building the future of AI-powered creativity. Join our team and help shape the next generation of creative tools." />; }
export function ContactPage() { return <SimplePage title="Contact Us" content="Have questions? Reach out to our team. We're here to help you get the most out of our platform." />; }
export function PrivacyPage() { return <SimplePage title="Privacy Policy" content="Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information." />; }
export function TermsPage() { return <SimplePage title="Terms of Service" content="By using our platform, you agree to these terms. Please read them carefully before creating an account." />; }
export function CookiesPage() { return <SimplePage title="Cookie Policy" content="We use cookies to improve your experience. This policy explains what cookies are and how we use them." />; }
export function TutorialsPage() { return <SimplePage title="Tutorials" content="Learn how to use AI generation tools effectively with our step-by-step guides and video tutorials." />; }
export function ShowcasePage() { return <SimplePage title="Showcase" content="Browse the best community creations and get inspired by what others are building with AI." />; }
export function ApiDocsPage() { return <SimplePage title="API Documentation" content="Integrate AI generation into your applications with our RESTful API. Full documentation and examples available." />; }
export function ChangelogPage() { return <SimplePage title="Changelog" content="Track the latest updates, new features, and improvements to our platform." />; }
