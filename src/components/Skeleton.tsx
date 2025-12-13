const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-800 rounded ${className}`}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const MovieRowSkeleton = () => {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-48 mb-4 mx-4 md:mx-8" />
      <div className="flex space-x-4 px-4 md:px-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-32 flex-shrink-0" />
        ))}
      </div>
    </div>
  );
};

export const BannerSkeleton = () => {
  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[600px] w-full">
      <Skeleton className="absolute inset-0" />
    </div>
  );
};

export default Skeleton;

