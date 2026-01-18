"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, Zap, Shield, Server, Cloud, BookOpen, ArrowRight, CheckCircle2, Copy, Check } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function HomePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npm install @nilovonjs/hcloud-js");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Enhanced */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 py-24 md:py-32 bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
        {/* Advanced Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-r from-green-500/5 to-transparent rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          
          {/* Floating particles */}
          <div className="absolute top-20 left-[20%] w-2 h-2 bg-primary/30 rounded-full animate-float" />
          <div className="absolute top-40 right-[30%] w-3 h-3 bg-blue-500/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-32 left-[70%] w-2 h-2 bg-purple-500/30 rounded-full animate-float" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Premium Badge */}
        <div className="group flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 backdrop-blur-md hover:border-primary/40 transition-all duration-300 animate-in fade-in slide-in-from-top-4 duration-700 hover:scale-105 shadow-lg shadow-primary/5">
          <Cloud className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text">
            Hetzner Cloud SDK
          </span>
        </div>
        
        {/* Hero Title with Enhanced Gradient */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <span className="bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text text-transparent hover:scale-105 inline-block transition-transform duration-300 cursor-default">
            hcloud-js
          </span>
        </h1>
        
        <p className="text-2xl md:text-3xl font-semibold text-muted-foreground max-w-2xl mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Hetzner Cloud, done right
        </p>
        
        <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 leading-relaxed">
          A modern TypeScript SDK that manages your Hetzner Cloud infrastructure with 
          full type safety and built-in validation – simple, secure, and intuitive.
        </p>

        {/* Enhanced Install Command with Working Copy Button */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-350">
          <div className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <code className="text-sm md:text-base font-mono text-foreground font-medium">
              npm install @nilovonjs/hcloud-js
            </code>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 group/btn"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500 animate-in zoom-in duration-200" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 mb-4">
          <Link
            href="/docs"
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground font-semibold hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <BookOpen className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
          <Link
            href="/docs/installation"
            className="group px-8 py-4 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm font-semibold hover:bg-muted hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <span>Installation</span>
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Subtle Trust Badge */}
        <div className="text-sm text-muted-foreground/60 animate-in fade-in duration-700 delay-450 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500/70" />
          <span>Zero dependencies • MIT Licensed • Production ready</span>
        </div>

        {/* Enhanced Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {[
            { value: "17+", label: "API Endpoints", color: "from-blue-500 to-blue-600" },
            { value: "100%", label: "Type Safe", color: "from-purple-500 to-purple-600" },
            { value: "0", label: "Extra Dependencies", color: "from-green-500 to-green-600" }
          ].map((stat, i) => (
            <div key={i} className="group text-center cursor-default">
              <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground mt-2 group-hover:text-foreground transition-colors font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section - Premium Design */}
      <div className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build and manage your Hetzner Cloud infrastructure
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Code2,
              title: "Fully Typed",
              description: "Complete TypeScript types for all API endpoints ensuring type safety and excellent IDE support with autocomplete.",
              gradient: "from-blue-500/20 to-blue-500/10",
              iconColor: "text-blue-500"
            },
            {
              icon: Zap,
              title: "Easy to Use",
              description: "Simple, intuitive API following modern JavaScript/TypeScript patterns. Get started in minutes with comprehensive docs.",
              gradient: "from-yellow-500/20 to-yellow-500/10",
              iconColor: "text-yellow-500"
            },
            {
              icon: Shield,
              title: "Validated",
              description: "Built-in validation using Zod schemas. All responses and requests are validated to prevent runtime errors.",
              gradient: "from-green-500/20 to-green-500/10",
              iconColor: "text-green-500"
            },
            {
              icon: Server,
              title: "Complete Coverage",
              description: "All Hetzner Cloud API endpoints supported: Servers, Networks, Load Balancers, DNS, and more.",
              gradient: "from-purple-500/20 to-purple-500/10",
              iconColor: "text-purple-500"
            },
            {
              icon: Cloud,
              title: "Modern Stack",
              description: "Built with Bun, TypeScript, and Zod. Works seamlessly in Node.js, Bun, and modern browsers.",
              gradient: "from-pink-500/20 to-pink-500/10",
              iconColor: "text-pink-500"
            },
            {
              icon: BookOpen,
              title: "Well Documented",
              description: "Comprehensive documentation with examples for every API endpoint and feature. Always up to date.",
              gradient: "from-orange-500/20 to-orange-500/10",
              iconColor: "text-orange-500"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Section - Enhanced */}
      <div className="container mx-auto px-4 py-24 border-t bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Started in Seconds
            </h2>
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
console.log(\`Found: \${servers.servers.length} servers\`);

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

          <div className="text-center mt-8">
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

      {/* API Coverage Section - Bento Grid Style */}
      <div className="container mx-auto px-4 py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Complete API Coverage
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All Hetzner Cloud endpoints with full TypeScript support
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {[
            "Servers", "Images", "Actions", "Certificates", "SSH Keys",
            "Locations", "Firewalls", "Floating IPs", "ISOs", "Placement Groups",
            "Primary IPs", "Server Types", "Load Balancers", "Networks",
            "Pricing", "Volumes", "DNS Zones"
          ].map((api) => (
            <div
              key={api}
              className="group relative px-4 py-5 rounded-xl border border-border bg-gradient-to-br from-card to-card/50 hover:border-primary/50 hover:from-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <CheckCircle2 className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {api}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/docs/api"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 font-semibold transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 hover:scale-105"
          >
            View API Reference
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
