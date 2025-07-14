export const formatDate = (date) => {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export const getInitials = (name) => {
  if (!name) return "?";

  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  } else {
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }
};

export const updateURL = ({ searchTerm, navigate, location }) => {
  const params = new URLSearchParams();

  if (searchTerm) {
    params.set("search", searchTerm);
  }

  const newURL = `${location?.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};

export const PriorityStyles = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

export const Task_Type = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-blue-600",
};

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-blue-600",
];

export const getCompletedSubTasks = (items) => {
  const totalCompleted = items?.filter((item) => item?.isCompleted).length;

  return totalCompleted;
};

export function countTasksByStage(tasks) {
  let inProgressCount = 0;
  let todoCount = 0;
  let completedCount = 0;

  tasks?.forEach((task) => {
    switch (task.stage.toLowerCase()) {
      case "in progress":
        inProgressCount++;
        break;
      case "todo":
        todoCount++;
        break;
      case "completed":
        completedCount++;
        break;
      default:
        break;
    }
  });

  return {
    inProgress: inProgressCount,
    todo: todoCount,
    completed: completedCount,
  };
}
