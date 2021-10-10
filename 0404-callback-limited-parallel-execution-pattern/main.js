const makeSampleTask = (name) => {
  return (cb) => {
    console.log(`${name} started`);

    setTimeout(() => {
      console.log(`${name} completed`);
      cb();
    }, Math.random() * 2000);
  };
};

const tasks = [
  makeSampleTask("Task 1"),
  makeSampleTask("Task 2"),
  makeSampleTask("Task 3"),
  makeSampleTask("Task 4")
];

const finish = () => {
  console.log("all tasks completed");
};

let completed = 0;

tasks.forEach(task => {
  task(() => {
    if (++completed === task.length) {
      finish();
    }
  });
});
