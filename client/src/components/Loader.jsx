export default function Loader({ className = 'py-24' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand" />
    </div>
  );
}
