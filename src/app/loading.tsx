export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }}
        />
        <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
          Loading data...
        </span>
      </div>
    </div>
  );
}
