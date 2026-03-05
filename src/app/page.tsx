'use client'

import Link from 'next/link'
import { Button } from '../components/ui/button'
import { ArrowRight, Zap, Code, Palette } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Hypeworks</div>
        <Link href="/auth/signin">
          <Button variant="outline">Sign In</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            AI-Powered A+ Content for Amazon
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Transform your product listings with stunning, AI-generated A+ content in minutes. First submission free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <button className="px-8 py-3 border border-slate-400 rounded-lg hover:bg-slate-700 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-slate-700/50 rounded-lg backdrop-blur">
            <Zap className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-slate-300">Get A+ content in minutes, not days</p>
          </div>
          <div className="p-6 bg-slate-700/50 rounded-lg backdrop-blur">
            <Code className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-slate-300">Advanced algorithms create compelling content</p>
          </div>
          <div className="p-6 bg-slate-700/50 rounded-lg backdrop-blur">
            <Palette className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customizable</h3>
            <p className="text-slate-300">Match your brand identity perfectly</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-blue-600/20 border-t border-blue-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to boost your listings?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Start with a free submission and see the difference A+ content makes
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Create Your First A+ Content</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-700 text-center text-slate-400">
        <p>&copy; 2024 Hypeworks. All rights reserved.</p>
      </footer>
    </div>
  )
}
