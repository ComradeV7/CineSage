type ErrorDisplayProps = {
  message: string;
};

export const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  return (
    <div className="error-display">
      <h2>Something went wrong</h2>
      <p>{message}</p>
    </div>
  );
};