/**
 * SAFE IMAGE CONVERSION GUIDE
 * 
 * This file provides instructions for converting standard Next.js Image components to 
 * SafeImage components across the application.
 * 
 * Follow these steps to ensure all images have proper fallback handling:
 */

/**
 * STEP 1: Import the SafeImage component
 * 
 * Replace:
 * ```
 * import Image from 'next/image';
 * ```
 * 
 * With:
 * ```
 * import { SafeImage } from '@/components/common';
 * ```
 */

/**
 * STEP 2: Replace Image components with SafeImage
 * 
 * Replace:
 * ```
 * <Image
 *   src={imageUrl}
 *   alt={alt}
 *   width={width}
 *   height={height}
 *   className={className}
 * />
 * ```
 * 
 * With:
 * ```
 * <SafeImage
 *   src={imageUrl}
 *   alt={alt}
 *   width={width}
 *   height={height}
 *   className={className}
 *   fallbackSrc={imageUrl}
 * />
 * ```
 */

/**
 * STEP 3: For dynamic images from APIs or external sources
 * 
 * Ensure that the image URLs are passed correctly to both src and fallbackSrc props:
 * 
 * ```
 * <SafeImage
 *   src={item.image.url}
 *   alt={item.title}
 *   width={300}
 *   height={200}
 *   className="object-cover"
 *   fallbackSrc={item.image.url}
 * />
 * ```
 */

/**
 * STEP 4: For fill mode images
 * 
 * When using Next.js Image with fill mode, ensure the container has position: relative and dimensions:
 * 
 * ```
 * <div className="relative w-full h-40">
 *   <SafeImage
 *     src={imageUrl}
 *     alt={alt}
 *     fill
 *     className="object-cover"
 *     fallbackSrc={imageUrl}
 *   />
 * </div>
 * ```
 */

/**
 * Usage Notes:
 * 
 * - The imgClassName prop can be used to style the fallback img element specifically
 * - The fallbackSrc prop is optional but recommended to ensure the same image is used in fallback
 * - For special cases where you want a different fallback image, provide a different fallbackSrc
 * - The SafeImage component handles both static and dynamic image sources
 */

// This is just a guide file, not meant to be executed
console.log('This is a guide file for converting to SafeImage components across the application.'); 