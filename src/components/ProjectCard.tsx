interface ProjectCardProps {
  id: string;
  name: string;
  deadline: string;
  progress: number;
  isOverdue: boolean;
}

const ProjectCard = ({ id, name, deadline, progress, isOverdue }: ProjectCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-500 mt-1">{id}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isOverdue
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isOverdue ? "Overdue" : "On Track"}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600 mb-3">
        <span>Progress: {progress}%</span>
        <span>📅 {deadline}</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            progress >= 75 ? "bg-green-500" : progress >= 50 ? "bg-blue-500" : "bg-yellow-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
