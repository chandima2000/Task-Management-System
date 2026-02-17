import { Button } from "@/components/ui/button";
import { StyledLink } from "@/components/ui/styled-link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      {/* Navigation */}
      <nav className="fixed top-6 z-50 flex items-center gap-6 rounded-full border border-glass bg-glass px-8 py-3 backdrop-blur-xl">
        <StyledLink href="/auth/login">Login</StyledLink>
        <StyledLink href="/auth/register" className="rounded-full bg-white/10 px-4 py-1.5 hover:bg-white/20">
          Get Started
        </StyledLink>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Manage Tasks with <span className="text-primary">Intelligence</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 sm:text-xl">
            A secure, platform designed for maximum productivity. Organize your work, track your progress, and leverage AI to break down complex projects.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <StyledLink href="/auth/register">
            <Button className="h-12 w-48 text-base">Start for Free</Button>
          </StyledLink>
          <StyledLink href="/auth/login">
            <Button variant="outline" className="h-12 w-48 text-base">
              Sign In
            </Button>
          </StyledLink>
        </div>

        {/* Feature Spotlight */}
        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          <FeatureCard
            title="Secure by Design"
            description="JWT-powered authentication and strict IDOR prevention for your data."
            icon="🔒"
          />
          <FeatureCard
            title="AI Powered"
            description="Leverage Google ADK to automatically break down complex sub-tasks."
            icon="🤖"
          />
          <FeatureCard
            title="Sleek UI/UX"
            description="A modern, high-fidelity experience optimized for productivity."
            icon="✨"
          />
        </div>
      </main>

    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="group rounded-2xl border border-glass bg-glass p-6 text-left transition-all duration-300 hover:border-primary/50 hover:bg-slate-900/40">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-slate-400 line-height-relaxed">{description}</p>
    </div>
  );
}
