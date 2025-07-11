import React from 'react';

// Define types for Payload CMS rich text structure
interface RichTextChild {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  [key: string]: any;
}

interface RichTextBlock {
  type?: string;
  children?: RichTextChild[];
  level?: number; // For headings
  listType?: 'ordered' | 'unordered'; // For lists
  url?: string; // For links
  newTab?: boolean; // For links
  value?: any; // For uploads/images
  [key: string]: any;
}

interface RichTextRendererProps {
  content: any;
  className?: string;
}

/**
 * Component to render Payload CMS rich text content
 * Handles the JSON structure and converts it to readable HTML
 */
export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // Helper function to render text nodes with formatting
  const renderTextNode = (node: RichTextChild, index: number): React.ReactNode => {
    if (typeof node === 'string') return node;
    
    let textContent = node.text || '';
    
    // Apply text formatting
    if (node.bold) textContent = <strong key={index}>{textContent}</strong>;
    if (node.italic) textContent = <em key={index}>{textContent}</em>;
    if (node.underline) textContent = <u key={index}>{textContent}</u>;
    if (node.strikethrough) textContent = <s key={index}>{textContent}</s>;
    if (node.code) textContent = <code key={index} className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">{textContent}</code>;
    
    return textContent;
  };

  // Helper function to render unknown node types
  const renderUnknownNode = (node: any, index: number): React.ReactNode => {
    if (node.children && Array.isArray(node.children)) {
      return <div key={index}>{node.children.map((child: any, i: number) => renderTextNode(child, i))}</div>;
    }
    return null;
  };

  // Main render function for rich text content
  const renderRichText = (content: any): React.ReactNode => {
    if (!content) return null;
    
    // If it's already an HTML string, render it directly
    if (typeof content === 'string') {
      // Check if it appears to be HTML
      if (content.includes('<') && content.includes('>')) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
      }
      // Plain text
      return <p>{content}</p>;
    }
    
    // If it's a Payload CMS richtext object or array
    if (typeof content === 'object') {
      // It may be an array of richtext nodes
      if (Array.isArray(content)) {
        return content.map((block: RichTextBlock, index: number) => {
          // Handle different node types
          if (block.type === 'paragraph') {
            return (
              <p key={index} className="mb-4">
                {block.children?.map((child: RichTextChild, i: number) => renderTextNode(child, i))}
              </p>
            );
          } else if (block.type === 'heading' && block.level) {
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            const headingClasses = {
              1: 'text-3xl font-bold mt-8 mb-4',
              2: 'text-2xl font-bold mt-6 mb-3',
              3: 'text-xl font-bold mt-5 mb-3',
              4: 'text-lg font-bold mt-4 mb-2',
              5: 'text-base font-bold mt-4 mb-2',
              6: 'text-sm font-bold mt-3 mb-2'
            };
            return (
              <HeadingTag key={index} className={headingClasses[block.level as keyof typeof headingClasses]}>
                {block.children?.map((child: RichTextChild, i: number) => renderTextNode(child, i))}
              </HeadingTag>
            );
          } else if (block.type === 'list' || block.type === 'ul' || block.type === 'ol') {
            const ListTag = (block.listType === 'ordered' || block.type === 'ol') ? 'ol' : 'ul';
            return (
              <ListTag key={index} className={`mb-4 ${ListTag === 'ol' ? 'list-decimal' : 'list-disc'} pl-5`}>
                {block.children?.map((item: any, i: number) => (
                  <li key={i} className="mb-2">
                    {item.children?.map((child: RichTextChild, j: number) => renderTextNode(child, j))}
                  </li>
                ))}
              </ListTag>
            );
          } else if (block.type === 'li') {
            // Handle list items that might be at the top level
            return (
              <li key={index} className="mb-1">
                {block.children?.map((child: RichTextChild, i: number) => renderTextNode(child, i))}
              </li>
            );
          } else if (block.type === 'link') {
            return (
              <a 
                key={index} 
                href={block.url} 
                target={block.newTab ? "_blank" : undefined}
                rel={block.newTab ? "noopener noreferrer" : undefined}
                className="text-hinomaru-red hover:underline"
              >
                {block.children?.map((child: RichTextChild, i: number) => renderTextNode(child, i))}
              </a>
            );
          } else if (block.type === 'upload') {
            return (
              <div key={index} className="my-6">
                <img 
                  src={block.value?.url} 
                  alt={block.value?.alt || "Image"} 
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
                {block.value?.caption && (
                  <p className="text-sm text-gray-600 mt-2 text-center">{block.value.caption}</p>
                )}
              </div>
            );
          } else if (block.type === 'blockquote') {
            return (
              <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic">
                {block.children?.map((child: RichTextChild, i: number) => renderTextNode(child, i))}
              </blockquote>
            );
          }
          
          // Handle blocks that might just have children without a specific type
          if (block.children && Array.isArray(block.children)) {
            return (
              <p key={index} className="mb-4">
                {block.children.map((child: RichTextChild, childIndex: number) => {
                  if (typeof child === 'string') return child;
                  return child.text || '';
                }).join(' ')}
              </p>
            );
          }
          
          // Fallback: try to render any text from unknown node types
          return renderUnknownNode(block, index);
        });
      }
      
      // It may be a single richtext object with a children array
      if (content.children && Array.isArray(content.children)) {
        return (
          <p className="mb-4">
            {content.children.map((child: RichTextChild, index: number) => {
              if (typeof child === 'string') return child;
              return child.text || '';
            }).join(' ')}
          </p>
        );
      }
    }
    
    // Fallback: render as text for development, show user-friendly message for production
    return (
      <p className="text-gray-600">
        {process.env.NODE_ENV === 'development' 
          ? `[Development] Unable to render content: ${JSON.stringify(content).substring(0, 100)}...`
          : 'Content not available in proper format.'
        }
      </p>
    );
  };

  return (
    <div className={`prose prose-zinc max-w-none ${className}`}>
      {renderRichText(content)}
    </div>
  );
};

export default RichTextRenderer; 