const { default: axios } = require("axios");
const { validateToken } = require("./CheckValidToken");
const { validationStatus } = require("./main");

exports.mission = async () => {
  try {
    const tokens = await validateToken();
    for (const token of tokens) {
      const validate = await validationStatus(token.token);
      if (validate !== null) {
        const task = await axios.post(
          "https://fishapi.xboost.io/zone/task/plist",
          {},
          {
            headers: {
              Authorization: `${token.token}`,
            },
          }
        );
        const tasks = task.data.data.tasks;

        const dailyTasks = tasks[0].tasks.filter(
          (task) => task.finished === "" && task.title !== "Daily invite"
        );
        const basicTasks = tasks[1].tasks.filter(
          (task) => task.finished === ""
        );
        if (basicTasks.length > 0) {
          for (const task of basicTasks) {
            try {
              const claimtask = await claimTask(token.token, task.task_id);
              console.log(claimtask);
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          console.log("no basic task");
        }

        if (dailyTasks.length > 0) {
          for (const task of dailyTasks) {
            try {
              const claimtask = await claimTask(token.token, task.task_id);
              console.log(claimtask);
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          console.log("no daily task");
        }
      } else {
        console.log("You have logged on another device");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const claimTask = async (token, taskId) => {
  try {
    const claim = await axios.post(
      "https://fishapi.xboost.io/zone/task/paction",
      {
        task_id: taskId,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return claim.data.data;
  } catch (error) {
    console.log(error);
  }
};
