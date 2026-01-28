export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/20 blur-3xl rounded-full animate-float" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent/10 blur-3xl rounded-full animate-float" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/10 blur-3xl rounded-full animate-float" />
      <div className="absolute inset-0 bg-grid opacity-40" />
    </div>
  );
}
