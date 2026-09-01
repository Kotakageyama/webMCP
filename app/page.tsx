import { getOrder } from "../lib/db";
import TaskSurface from "./task-surface";
export default async function Home() { return <TaskSurface initialOrder={await getOrder("TS-1042")} />; }
