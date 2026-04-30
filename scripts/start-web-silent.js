const { spawn } = require("child_process");

const child = spawn("npx", ["expo", "start", "--web", "--port", "8081"], {
  stdio: "ignore",
  shell: true,
});

process.on("SIGTERM", () => {
  child.kill();
  process.exit();
});
process.on("SIGINT", () => {
  child.kill();
  process.exit();
});
child.on("exit", (code) => process.exit(code || 0));
