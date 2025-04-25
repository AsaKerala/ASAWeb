# Image Fallback Solution for ASA Kerala Website

This document explains the image handling solution implemented to fix issues with Next.js Image optimization, particularly in development environments or when the image optimization server fails.

## Problem

The Next.js Image component (`next/image`) sometimes fails with a 500 error:

```
Request URL: http://localhost:3000/_next/image?url=...&w=256&q=75
Status Code: 500 Internal Server Error
```

This primarily happens in development mode, or in some production environments with specific configurations. When this occurs, images simply fail to load with no built-in fallback mechanism.

## Solution

We've implemented a multi-layered approach to handle image loading failures:

1. **SafeImage Component**: A custom component that tries Next.js Image first, then falls back to a standard HTML `<img>` tag if optimization fails.
2. **ImageProvider**: A global context provider that can toggle between Next.js Image and fallback mode for the entire application.
3. **GlobalImage Component**: A component that uses either Next.js Image or SafeImage based on the ImageProvider's configuration.

## Implementation Details

### SafeImage Component

Located at: `frontend/src/components/common/SafeImage.tsx`

This component:
- Attempts to use the Next.js Image component first
- If it fails (caught via onError), it renders a standard HTML img tag
- Preserves styling, dimensions, and other props
- Includes a `fallbackSrc` prop to specify an alternative image source if needed

```tsx
<SafeImage 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={300} 
  height={200} 
  className="object-cover"
  fallbackSrc="/path/to/image.jpg"  // Optional, defaults to src
/>
```

### ImageProvider

Located at: `frontend/src/providers/ImageProvider.tsx`

This context provider:
- Manages a global toggle for fallback mode
- Is configured in `layout.tsx` to use fallback mode in development by default
- Can be manually toggled if needed

### Global Context Usage

The application is wrapped with the ImageProvider in the root layout:

```tsx
<ImageProvider initialFallbackMode={process.env.NODE_ENV === 'development'}>
  <App />
</ImageProvider>
```

## Usage Guidelines

### Direct SafeImage Usage

For individual components, you can directly use the SafeImage component:

```tsx
import { SafeImage } from '@/components/common';

// In your component:
<SafeImage 
  src={imageUrl} 
  alt="Description" 
  width={200} 
  height={200} 
  fallbackSrc={imageUrl}
/>
```

### With GlobalImage Component

For components that should respect the global configuration:

```tsx
import { GlobalImage } from '@/providers/ImageProvider';

// In your component:
<GlobalImage 
  src={imageUrl} 
  alt="Description" 
  width={200} 
  height={200} 
  fallbackSrc={imageUrl}
/>
```

### Handling Dynamic Images from APIs

When displaying images from your APIs:

```tsx
<SafeImage 
  src={item.photo.url} 
  alt={item.name} 
  width={128} 
  height={128} 
  className="object-cover w-full h-full"
  fallbackSrc={item.photo.url}
/>
```

## Best Practices

1. **Always provide a fallbackSrc**: Typically this should be the same as the src, but in some cases, you might want a simplified version.
2. **Use in critical image areas first**: Prioritize using SafeImage in areas where image display is critical.
3. **Test in both dev and prod modes**: Verify your images work correctly in both environments.
4. **Sized Images**: Always provide width and height when possible to avoid layout shifts.
5. **Position Relative Containers**: When using `fill`, ensure the parent has `position: relative` and dimensions.

## Conversion Guide

For guidance on converting existing Image components to SafeImage, refer to:
`frontend/src/scripts/convert-to-safe-images.js`

## Technical Notes

- The fallback mechanism works by catching the `onError` event of the Next.js Image component
- The implementation maintains responsive behavior and styling
- There's minimal performance impact as the fallback only activates when needed
- The solution gracefully degrades from optimized images to standard ones

## Future Improvements

- Add monitoring to track image optimization failures
- Implement automatic retry logic before falling back
- Add support for blur placeholders in fallback mode
- Consider progressive image loading techniques 