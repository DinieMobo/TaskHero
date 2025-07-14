import asyncHandler from "express-async-handler";
import Notice from "../models/notice.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

// Create Task controller
const createTask = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, stage, date, priority, assets, links, description, team } =
      req.body;

    let text = `New task "${title}" has been created.`;
    text += ` This ${priority} priority task is scheduled for ${new Date(
      date
    ).toLocaleDateString()}.`;
    
    if (description && description.length > 0) {
      const descSnippet = description.length > 50 
      ? description.substring(0, 50) + '...' 
      : description;
      text += ` Details: ${descSnippet}`;
    }
    
    if (team && team.length > 0) {
      text += ` Assigned to ${team.length} team member${team.length > 1 ? 's' : ''}.`;
    }

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };
    let newLinks = null;

    if (links) {
      newLinks = links?.split(",");
    }

    const task = await Task.create({
      title,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: [activity],
      links: newLinks || [],
      description,
      team: team || [userId],
    });

    await Notice.create({
      text,
      task: task._id,
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
});

// Duplicate Task controller
const duplicateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const task = await Task.findById(id).lean();

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found." });
    }

    let text = `Task "${task.title}" has been duplicated.`;
    text += ` This ${task.priority} priority task is scheduled for ${new Date(
      task.date
      ).toLocaleDateString()}. Please review the duplicate and update as needed.`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const { _id, createdAt, updatedAt, ...taskData } = task;

    const newTask = await Task.create({
      ...taskData,
      title: "Duplicate - " + task.title,
      activities: [activity],
    });

    await Notice.create({
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

// Update Task controller
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, date, stage, priority, assets, links, description } =
    req.body;

  try {
    const task = await Task.findById(id);

    let newLinks = [];

    if (links) {
      newLinks = links.split(",");
    }

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.links = newLinks;
    task.description = description;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Get Task controller
const getTasks = asyncHandler(async (req, res) => {
  const { stage, isTrashed, search } = req.query;

  let query = { isTrashed: isTrashed ? true : false };

  if (stage) {
    query.stage = stage;
  }

  if (search) {
    const searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { stage: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
      ],
    };
    query = { ...query, ...searchQuery };
  }

  let queryResult = Task.find(query)
    .sort({ _id: -1 });

  const tasks = await queryResult;

  res.status(200).json({
    status: true,
    tasks,
  });
});

const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch task", error);
  }
});

// Post Task Activity controller
const postTaskActivity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const { type, activity } = req.body;

  try {
    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };
    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Trash Task controller
const trashTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Delete or Restore Task controller
const deleteRestoreTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;

      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Dashboard Statistics controller
const dashboardStatistics = asyncHandler(async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $in: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isActive createdAt")
      .limit(10)
      .sort({ _id: -1 });

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const lastMonthTasks = allTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= lastMonthStart && taskDate <= lastMonthEnd;
    });

    const groupedTasks = allTasks?.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    const lastMonthGroupedTasks = lastMonthTasks?.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    const graphData = Object.entries(
      allTasks?.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    const totalTasks = allTasks.length;
    const last10Task = allTasks?.slice(0, 10);
    const lastMonthTotal = lastMonthTasks.length;

    const summary = {
      totalTasks,
      lastMonthTotal,
      last10Task,
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      lastMonthTasks: lastMonthGroupedTasks,
      graphData,
    };

    res
      .status(200)
      .json({ status: true, ...summary, message: "Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Update Task Stage controller
const updateTaskStage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }
    
    task.stage = stage.toLowerCase();
    await task.save();
    
    res.status(200).json({ 
      status: true, 
      message: "Task stage updated successfully" 
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Update SubTask Stage controller
const updateSubTaskStage = asyncHandler(async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { status } = req.body;
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }
    
    const subtask = task.subTasks.id(subTaskId);
    
    if (!subtask) {
      return res.status(404).json({ status: false, message: "Subtask not found" });
    }
    
    subtask.isCompleted = status;
    await task.save();
    
    res.status(200).json({ 
      status: true, 
      message: `Subtask marked as ${status ? 'completed' : 'in progress'}` 
    });
  } catch (error) {
    console.error("Update subtask stage error:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

// Create SubTask controller
const createSubTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const { userId } = req.user;
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }
    
    const subTask = {
      title,
      description,
      date: new Date(),
      isCompleted: false,
      createdBy: userId
    };
    
    task.subTasks.push(subTask);
    await task.save();
    
    res.status(200).json({
      status: true,
      message: "Subtask created successfully"
    });
  } catch (error) {
    console.error("Create subtask error:", error);
    return res.status(400).json({ status: false, message: error.message });
  }
});

export {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateSubTaskStage,
  updateTask,
  updateTaskStage,
};