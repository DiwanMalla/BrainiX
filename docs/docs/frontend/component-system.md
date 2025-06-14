# Component System

The BrainiX frontend is built with a modern, scalable component architecture using React 18, TypeScript, and a comprehensive design system powered by Radix UI and Shadcn/ui components.

## Overview

The component system provides:
- **Consistent Design Language** across all interfaces
- **Accessible Components** following WCAG guidelines  
- **Type-Safe Development** with comprehensive TypeScript coverage
- **Reusable Component Library** with standardized props
- **Performance Optimization** through memoization and lazy loading
- **Responsive Design** with mobile-first approach

## Architecture

### Component Hierarchy

```
App Root
├── Layout Components
│   ├── Navbar
│   ├── Sidebar
│   └── Footer
├── Page Components
│   ├── Dashboard
│   ├── Course Pages
│   └── Authentication
├── Feature Components
│   ├── Course Management
│   ├── Learning Interface
│   └── Payment Processing
└── UI Components
    ├── Primitives (Button, Input, Card)
    ├── Composite (DataTable, Modal)
    └── Custom (VideoPlayer, QuizInterface)
```

### Design System Foundation

```typescript
// Design System Configuration
export const designTokens = {
  colors: {
    primary: {
      50: '#f5f3ff',
      500: '#8b5cf6',
      900: '#4c1d95',
    },
    secondary: {
      50: '#f8fafc',
      500: '#64748b',
      900: '#0f172a',
    },
    accent: {
      50: '#fef3c7',
      500: '#f59e0b',
      900: '#92400e',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    4: '1rem',
    8: '2rem',
    16: '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
};
```

## UI Component Library

### Base Components

```typescript
// Button Component with Variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          loading && 'opacity-50 cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

// Button Variants using Class Variance Authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Form Components

```typescript
// Enhanced Input Component with Validation
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = useId();

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
```

### Card Components

```typescript
// Flexible Card Component System
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        {
          'border-border': variant === 'outlined',
          'shadow-lg': variant === 'elevated',
          'p-0': padding === 'none',
          'p-3': padding === 'sm', 
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    />
  )
);

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
```

## Feature Components

### Course Card Component

```typescript
// Comprehensive Course Card with Interactive Features
interface CourseCardProps {
  course: Course;
  variant?: 'grid' | 'list' | 'featured';
  showInstructor?: boolean;
  showProgress?: boolean;
  onEnroll?: (courseId: string) => void;
  onAddToCart?: (courseId: string) => void;
  onAddToWishlist?: (courseId: string) => void;
}

export const CourseCard = memo<CourseCardProps>(({
  course,
  variant = 'grid',
  showInstructor = true,
  showProgress = false,
  onEnroll,
  onAddToCart,
  onAddToWishlist,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Prevent navigation when clicking on action buttons
    if ((e.target as HTMLElement).closest('[data-action]')) {
      return;
    }
    router.push(`/courses/${course.slug}`);
  }, [course.slug, router]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(course.id);
    toast({
      title: 'Added to Cart',
      description: `${course.title} has been added to your cart.`,
    });
  }, [course.id, course.title, onAddToCart]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: 'Sign in Required',
        description: 'Please sign in to add courses to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: isInWishlist ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        toast({
          title: isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
          description: `${course.title} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      });
    }
  }, [user, course.id, course.title, isInWishlist]);

  if (variant === 'list') {
    return (
      <Card className="flex overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
        <div className="w-48 h-32 relative flex-shrink-0">
          <Image
            src={course.thumbnail || '/placeholder.svg'}
            alt={course.title}
            fill
            className="object-cover"
            sizes="192px"
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              data-action="wishlist"
              onClick={handleWishlistToggle}
              className="flex-shrink-0"
            >
              <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current text-red-500')} />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {course.shortDescription}
          </p>
          {showInstructor && (
            <p className="text-sm mb-3">
              by <span className="font-medium">{course.instructor.firstName} {course.instructor.lastName}</span>
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{course.level}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                {course.averageRating.toFixed(1)} ({course._count.reviews})
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">${course.discountPrice || course.price}</span>
              {course.discountPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${course.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleCardClick}>
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={course.thumbnail || '/placeholder.svg'}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={variant === 'featured'}
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            data-action="wishlist"
            onClick={handleWishlistToggle}
            className="bg-white/80 hover:bg-white"
          >
            <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current text-red-500')} />
          </Button>
        </div>
        {course.featured && (
          <Badge className="absolute top-2 left-2" variant="default">
            Featured
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{course.title}</h3>
          {showInstructor && (
            <p className="text-sm text-muted-foreground">
              by {course.instructor.firstName} {course.instructor.lastName}
            </p>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {course.shortDescription}
        </p>

        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="secondary">{course.level}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
            {course.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {course.totalStudents}
          </div>
        </div>

        {showProgress && course.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {course.discountPrice ? (
              <>
                <span className="font-bold text-lg">${course.discountPrice}</span>
                <span className="text-sm text-muted-foreground line-through">
                  ${course.price}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg">${course.price}</span>
            )}
          </div>
          
          <Button
            size="sm"
            data-action="add-to-cart"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

CourseCard.displayName = 'CourseCard';
```

### Video Player Component

```typescript
// Advanced Video Player with Learning Features
interface VideoPlayerProps {
  lesson: Lesson;
  enrollment: Enrollment;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export const VideoPlayer = memo<VideoPlayerProps>(({
  lesson,
  enrollment,
  onProgress,
  onComplete,
  autoPlay = false,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced progress saving
  const debouncedSaveProgress = useCallback(
    debounce(async (watchedSeconds: number) => {
      try {
        await fetch('/api/courses/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson.id,
            watchedSeconds,
            completed: false,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }, 5000),
    [lesson.id]
  );

  const handleProgress = useCallback((state: {
    playedSeconds: number;
    played: number;
  }) => {
    setCurrentTime(state.playedSeconds);
    debouncedSaveProgress(state.playedSeconds);
    onProgress?.(state.played * 100);
  }, [debouncedSaveProgress, onProgress]);

  const handleDuration = useCallback((duration: number) => {
    setDuration(duration);
  }, []);

  const handleEnded = useCallback(async () => {
    try {
      await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          watchedSeconds: duration,
          completed: true,
        }),
      });
      
      onComplete?.();
      
      toast({
        title: 'Lesson Complete!',
        description: 'You have successfully completed this lesson.',
      });
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  }, [lesson.id, duration, onComplete]);

  const handleReady = useCallback(() => {
    setIsReady(true);
    // Resume from last position if available
    if (lesson.lastWatchedSeconds && lesson.lastWatchedSeconds > 30) {
      playerRef.current?.seekTo(lesson.lastWatchedSeconds, 'seconds');
    }
  }, [lesson.lastWatchedSeconds]);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, 'seconds');
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isReady) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          // Toggle play/pause
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekTo(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekTo(Math.min(duration, currentTime + 10));
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isReady, currentTime, duration, seekTo, toggleFullscreen]);

  const normalizeYouTubeUrl = (url: string) => {
    if (!url) return '';
    
    // Convert various YouTube URL formats to embed format
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/watch?v=${match[2]}`;
    }
    
    return url;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none'
      )}
    >
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={normalizeYouTubeUrl(lesson.videoUrl)}
        width="100%"
        height="100%"
        controls={false} // Use custom controls
        playing={autoPlay}
        playbackRate={playbackRate}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        onReady={handleReady}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              modestbranding: 1,
              origin: window.location.origin,
            },
          },
        }}
      />

      {/* Custom Controls */}
      {isReady && (
        <VideoControls
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          volume={volume}
          isFullscreen={isFullscreen}
          onSeek={seekTo}
          onPlaybackRateChange={setPlaybackRate}
          onVolumeChange={setVolume}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
```

## Performance Optimization

### Component Memoization

```typescript
// Smart memoization with custom comparison
const CourseGrid = memo<CourseGridProps>(({ courses, onCourseSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={onCourseSelect}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.courses.length === nextProps.courses.length &&
    prevProps.courses.every((course, index) => 
      course.id === nextProps.courses[index]?.id &&
      course.updatedAt === nextProps.courses[index]?.updatedAt
    )
  );
});
```

### Lazy Loading

```typescript
// Dynamic imports for heavy components
const VideoPlayer = dynamic(
  () => import('@/components/video/VideoPlayer'),
  {
    loading: () => (
      <div className="aspect-video bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false,
  }
);

const AIQuizGenerator = dynamic(
  () => import('@/components/quiz/AIQuizGenerator'),
  {
    loading: () => <QuizGeneratorSkeleton />,
    ssr: false,
  }
);

const MarkdownEditor = dynamic(
  () => import('@/components/editor/MarkdownEditor'),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);
```

### Virtual Scrolling

```typescript
// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

interface VirtualCourseListProps {
  courses: Course[];
  onCourseClick: (course: Course) => void;
}

export const VirtualCourseList: React.FC<VirtualCourseListProps> = ({
  courses,
  onCourseClick,
}) => {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <CourseCard
        course={courses[index]}
        variant="list"
        onEnroll={() => onCourseClick(courses[index])}
      />
    </div>
  ), [courses, onCourseClick]);

  return (
    <List
      height={600}
      itemCount={courses.length}
      itemSize={140}
      overscanCount={5}
    >
      {Row}
    </List>
  );
};
```

## Accessibility Features

### ARIA Implementation

```typescript
// Accessible Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {description && (
            <p id={descriptionId} className="text-muted-foreground mb-4">
              {description}
            </p>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};
```

### Keyboard Navigation

```typescript
// Keyboard-accessible dropdown menu
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          onSelect(items[focusedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [items, focusedIndex, onSelect]);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </Button>
      
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              role="menuitem"
              className={cn(
                'block w-full text-left px-4 py-2 hover:bg-gray-100',
                index === focusedIndex && 'bg-gray-100'
              )}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Testing Strategy

### Component Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseCard } from '@/components/course/CourseCard';

describe('CourseCard', () => {
  const mockCourse = {
    id: '1',
    title: 'Test Course',
    slug: 'test-course',
    price: 99.99,
    discountPrice: 79.99,
    thumbnail: '/test-image.jpg',
    shortDescription: 'Test description',
    level: 'BEGINNER',
    averageRating: 4.5,
    totalStudents: 100,
    instructor: {
      firstName: 'John',
      lastName: 'Doe',
    },
    _count: {
      reviews: 25,
    },
  };

  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} />);
    
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('by John Doe')).toBeInTheDocument();
    expect(screen.getByText('$79.99')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const mockOnAddToCart = jest.fn();
    render(
      <CourseCard 
        course={mockCourse} 
        onAddToCart={mockOnAddToCart} 
      />
    );
    
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    await waitFor(() => {
      expect(mockOnAddToCart).toHaveBeenCalledWith('1');
    });
  });

  it('shows progress bar when showProgress is true', () => {
    const courseWithProgress = { ...mockCourse, progress: 65 };
    render(
      <CourseCard 
        course={courseWithProgress} 
        showProgress={true} 
      />
    );
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });
});
```

The component system provides a robust foundation for building consistent, accessible, and performant user interfaces throughout the BrainiX platform.
