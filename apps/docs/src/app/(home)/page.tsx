import Link from "next/link";
import { Code2, Zap, Shield, Server, Cloud, BookOpen, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <Cloud className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Hetzner Cloud SDK</span>
          <Sparkles className="w-3 h-3 text-primary/60 ml-1" />
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <span className="bg-gradient-to-r from-foreground via-primary/80 to-foreground bg-clip-text text-transparent">
            hcloud-js
          </span>
        </h1>
        
        <p className="text-2xl md:text-3xl font-semibold text-muted-foreground max-w-2xl mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          TypeScript SDK for the Hetzner Cloud API
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          A fully typed, modern TypeScript SDK for managing your Hetzner Cloud infrastructure.
          Built with type safety, validation, and developer experience in mind.
        </p>

        <div className="flex gap-4 flex-wrap justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <Link
            href="/docs"
            className="group relative px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/installation"
            className="px-8 py-4 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm font-semibold hover:bg-muted hover:border-primary/20 transition-all duration-200 hover:scale-105"
          >
            Installation
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text">17+</div>
            <div className="text-sm md:text-base text-muted-foreground mt-1">APIs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text">100%</div>
            <div className="text-sm md:text-base text-muted-foreground mt-1">Typed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text">0 deps</div>
            <div className="text-sm md:text-base text-muted-foreground mt-1">Extra</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build and manage your Hetzner Cloud infrastructure
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fully Typed</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complete TypeScript types for all API endpoints, ensuring type safety and excellent IDE support with autocomplete.
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Easy to Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simple, intuitive API that follows modern JavaScript/TypeScript patterns. Get started in minutes with our comprehensive docs.
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Validated</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built-in validation using Zod schemas. All responses and requests are validated before use, preventing runtime errors.
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Server className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Complete Coverage</h3>
              <p className="text-muted-foreground leading-relaxed">
                All Hetzner Cloud API endpoints are supported, including Servers, Networks, Load Balancers, DNS, and more.
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cloud className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Modern Stack</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with Bun, TypeScript, and Zod. Works seamlessly in Node.js, Bun, and modern browsers.
              </p>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Well Documented</h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive documentation with examples for every API endpoint and feature. Always up to date.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="container mx-auto px-4 py-24 border-t bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Started in Seconds</h2>
            <p className="text-xl text-muted-foreground">
              Install the package and start managing your infrastructure
            </p>
          </div>
          
          <CodeBlock
            code={`import { HCloudClient } from '@nilovonjs/hcloud-js';

const client = new HCloudClient({
  token: 'your-api-token'
});

// List all servers
const servers = await client.servers.list();
console.log(\`Found \${servers.servers.length} server(s)\`);

// Get a specific server
const server = await client.servers.get(12345);
console.log(server.server.name);

// Create a new server
const newServer = await client.servers.create({
  name: 'my-server',
  server_type: 'cpx11',
  image: 'ubuntu-22.04',
  location: 'nbg1'
});`}
            language="typescript"
          />

          <div className="text-center">
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center gap-2 text-lg text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Read the full documentation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* API Coverage Section */}
      <div className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Complete API Coverage</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All Hetzner Cloud endpoints are available with full TypeScript support
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[
            "Servers",
            "Images",
            "Actions",
            "Certificates",
            "SSH Keys",
            "Locations",
            "Firewalls",
            "Floating IPs",
            "ISOs",
            "Placement Groups",
            "Primary IPs",
            "Server Types",
            "Load Balancers",
            "Networks",
            "Pricing",
            "Volumes",
            "DNS (Zones)",
          ].map((api) => (
            <div
              key={api}
              className="group relative px-6 py-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-semibold">{api}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/docs/api"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 font-semibold transition-all hover:border-primary/40"
          >
            View API Reference
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
