'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { news } from '@/lib/api';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SafeImage } from '@/components/common';
import Link from 'next/link';

// Helper function to render rich text content
const renderRichText = (content: any): React.ReactNode => {
  if (!content) return null;
  
  // If content is a string (HTML), return it directly
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  // If content is an array (Payload CMS rich text format)
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((node, index) => {
          // Handle different node types
          if (node.type === 'paragraph') {
            return <p key={index} className="mb-4">{node.children.map((child: any, i: number) => renderTextNode(child, i))}</p>;
          } else if (node.type === 'heading') {
            const HeadingTag = `h${node.level}` as keyof JSX.IntrinsicElements;
            const headingClasses = {
              1: 'text-3xl font-bold mt-8 mb-4',
              2: 'text-2xl font-bold mt-6 mb-3',
              3: 'text-xl font-bold mt-5 mb-3',
              4: 'text-lg font-bold mt-4 mb-2',
              5: 'text-base font-bold mt-4 mb-2',
              6: 'text-sm font-bold mt-3 mb-2'
            };
            return <HeadingTag key={index} className={headingClasses[node.level as keyof typeof headingClasses]}>{node.children.map((child: any, i: number) => renderTextNode(child, i))}</HeadingTag>;
          } else if (node.type === 'list') {
            const ListTag = node.listType === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className={`mb-4 ${node.listType === 'ordered' ? 'list-decimal' : 'list-disc'} pl-5`}>
                {node.children.map((item: any, i: number) => (
                  <li key={i}>{item.children.map((child: any, j: number) => renderTextNode(child, j))}</li>
                ))}
              </ListTag>
            );
          } else if (node.type === 'link') {
            return (
              <a 
                key={index} 
                href={node.url} 
                target={node.newTab ? "_blank" : undefined}
                rel={node.newTab ? "noopener noreferrer" : undefined}
                className="text-hinomaru-red hover:underline"
              >
                {node.children.map((child: any, i: number) => renderTextNode(child, i))}
              </a>
            );
          } else if (node.type === 'upload') {
            return (
              <div key={index} className="my-6">
                <img 
                  src={node.value?.url} 
                  alt={node.value?.alt || "Image"} 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
                {node.value?.caption && (
                  <p className="text-sm text-gray-600 mt-2 text-center">{node.value.caption}</p>
                )}
              </div>
            );
          } else if (node.type === 'blockquote') {
            return (
              <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic">
                {node.children.map((child: any, i: number) => renderTextNode(child, i))}
              </blockquote>
            );
          }
          
          // Fallback: try to render any text from unknown node types
          return renderUnknownNode(node, index);
        })}
      </>
    );
  }
  
  // Fallback for unknown content format
  return <p className="text-red-500">Unable to render content</p>;
};

// Helper to render text nodes with formatting
const renderTextNode = (node: any, index: number): React.ReactNode => {
  if (typeof node === 'string') return node;
  
  let content = node.text;
  
  // Apply text formatting
  if (node.bold) content = <strong key={index}>{content}</strong>;
  if (node.italic) content = <em key={index}>{content}</em>;
  if (node.underline) content = <u key={index}>{content}</u>;
  if (node.strikethrough) content = <s key={index}>{content}</s>;
  if (node.code) content = <code key={index} className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">{content}</code>;
  
  return content;
};

// Fallback for unknown node types
const renderUnknownNode = (node: any, index: number): React.ReactNode => {
  if (node.children && Array.isArray(node.children)) {
    return <div key={index}>{node.children.map((child: any, i: number) => renderTextNode(child, i))}</div>;
  }
  return null;
};

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // First attempt: Direct fetch by slug
        try {
          const response = await news.getOne(slug as string);
          setArticle(response.data);
          setError(null);
        } catch (err) {
          console.error('Direct slug fetch failed, trying fallback method:', err);
          
          // Fallback: Query the collection with a where clause
          const queryResponse = await news.getAll({ 
            where: { 
              slug: { equals: slug },
              status: { equals: 'published' }
            }
          });
          
          if (queryResponse.data?.docs && queryResponse.data.docs.length > 0) {
            setArticle(queryResponse.data.docs[0]);
            setError(null);
          } else {
            throw new Error('Article not found');
          }
        }
      } catch (err) {
        console.error('Error fetching news article:', err);
        setError('Failed to load the news article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Helper function to determine article category label
  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'announcement': 'Announcement',
      'newsletter': 'Newsletter',
      'event-report': 'Event Report',
      'press-release': 'Press Release',
      'member-spotlight': 'Member Spotlight',
      'organization-update': 'Organization Update'
    };
    return categoryMap[category] || 'News';
  };

  // Helper function to determine category label color
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'announcement': 'bg-hinomaru-red text-white',
      'newsletter': 'bg-blue-600 text-white',
      'event-report': 'bg-green-600 text-white',
      'press-release': 'bg-purple-600 text-white',
      'member-spotlight': 'bg-amber-600 text-white',
      'organization-update': 'bg-teal-600 text-white'
    };
    return colorMap[category] || 'bg-hinomaru-red text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-zinc-700 mb-6">{error}</p>
            <Link href="/news" className="inline-block px-6 py-3 bg-hinomaru-red text-white rounded-washi hover:bg-red-700 transition-colors">
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-50 py-16">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 mb-4">Article Not Found</h1>
            <p className="text-zinc-700 mb-6">The article you're looking for could not be found.</p>
            <Link href="/news" className="inline-block px-6 py-3 bg-hinomaru-red text-white rounded-washi hover:bg-red-700 transition-colors">
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section with Featured Image */}
      {article.featuredImage ? (
        <div className="relative h-96 w-full">
          <SafeImage
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
            fill
            className="object-cover"
            fallbackSrc={article.featuredImage.url}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 w-full p-8 text-white">
            <div className="container-custom">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${getCategoryColor(article.category)}`}>
                {getCategoryLabel(article.category)}
              </span>
              <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
              <div className="flex items-center text-white/80 text-sm">
                {article.publishedDate && (
                  <span>
                    {format(new Date(article.publishedDate), 'MMMM d, yyyy')}
                  </span>
                )}
                {article.author && article.author.name && (
                  <>
                    <span className="mx-2">•</span>
                    <span>By {article.author.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 text-white py-16">
          <div className="container-custom">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${getCategoryColor(article.category)}`}>
              {getCategoryLabel(article.category)}
            </span>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center text-white/80 text-sm">
              {article.publishedDate && (
                <span>
                  {format(new Date(article.publishedDate), 'MMMM d, yyyy')}
                </span>
              )}
              {article.author && article.author.name && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {article.author.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            {article.summary && (
              <div className="mb-8 text-lg text-zinc-700 font-medium border-l-4 border-hinomaru-red pl-4 py-2">
                {article.summary}
              </div>
            )}
            
            <div className="prose prose-lg text-black max-w-none prose-headings:text-zinc-900 prose-p:text-zinc-700">
              {renderRichText(article.content)}
            </div>
            
            {/* Attachments Section if any */}
            {article.attachments && article.attachments.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-zinc-900 mb-4">Attachments</h3>
                <div className="space-y-3">
                  {article.attachments.map((attachment: any) => (
                    <a 
                      key={attachment.id} 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-hinomaru-red mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900">{attachment.filename || 'Download Attachment'}</p>
                        <p className="text-sm text-zinc-500">{attachment.mimeType}</p>
                      </div>
                      <span className="text-hinomaru-red">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Back to News Button */}
          <div className="text-center mt-10">
            <Link href="/news" className="inline-block px-6 py-3 bg-zinc-800 text-white rounded-washi hover:bg-zinc-900 transition-colors">
              Back to News
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 