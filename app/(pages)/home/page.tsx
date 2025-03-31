import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/home" className="text-2xl font-bold text-gray-900 dark:text-white">
                My Blog
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link href="/home" className="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                Home
              </Link>
              <Link href="/posts" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                Posts
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to My Blog</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            A place where I share my thoughts, ideas, and experiences.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/posts" 
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Read Posts
            </Link>
            <Link 
              href="/about" 
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-md"
            >
              About Me
            </Link>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for posts */}
            {[1, 2, 3].map((post) => (
              <div key={post} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">March 31, 2024</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Sample Blog Post {post}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    This is a sample excerpt for a blog post. It gives a brief overview of what the post is about.
                  </p>
                  <Link 
                    href={`/posts/sample-${post}`} 
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link 
              href="/posts" 
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              View all posts →
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-300">
                © 2024 My Blog. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  GitHub
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 