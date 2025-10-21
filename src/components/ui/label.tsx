export default function Label({
  children,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}
