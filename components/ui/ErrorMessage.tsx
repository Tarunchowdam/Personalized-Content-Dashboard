interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Oops! Something went wrong</h2>
      <p className="text-muted-foreground text-center max-w-md">{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 btn btn-primary"
      >
        Try Again
      </button>
    </div>
  );
} 