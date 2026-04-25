import { execSync } from "child_process";

export default async function globalSetup() {
  execSync("npx convex run seed:reset", { stdio: "inherit" });
  execSync("npx convex run seed", { stdio: "inherit" });
}
