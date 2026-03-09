interface StatsCardProps {
  value: number;
  label: string;
  color: "primary" | "success" | "destructive";
}

const StatsCard = ({ value, label, color }: StatsCardProps) => {
  const colorClasses = {
    primary: "text-blue-600",
    success: "text-green-600",
    destructive: "text-red-600",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 shadow-sm">
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

export default StatsCard;
