import { Task } from "src/app/task/interface/task";

export interface TaskDialogResult {
    task: Task;
    delete?: boolean;
}
