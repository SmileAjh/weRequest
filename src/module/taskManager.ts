import { IRequestOption } from "../interface"
import requestHandler from './requestHandler'
// 依赖登录态的请求队列逻辑，在发现登录态失效时及时进行abort，登录态生效之后重新请求

const taskQueue : any = {}; // 请求任务队列
let waitRedoTask : IRequestOption[] = []; // 准备重新请求的队列
let maxQueueSize = 100; // 队列最大长度限制，可通过配置修改

// 设置队列最大长度
function setMaxQueueSize(size: number) {
  if (size > 0) {
    maxQueueSize = size;
  }
}

// 获取当前队列最大长度
function getMaxQueueSize(): number {
  return maxQueueSize;
}

function addSessionTask(task : any, obj: IRequestOption) {
  if (!obj.notNeedSession) {
    // 检查队列长度，如果超过则直接返回，不添加，依赖登陆态失效自动重试
    if (Object.keys(taskQueue).length >= maxQueueSize) {
      console.log('Task queue is full, not add task:', obj.url);
      return;
    }
    
    taskQueue[obj.tag] = {
      task,
      obj
    };
  }
}

function abortSessionTask() {
  waitRedoTask = [];
  
  for (const tag in taskQueue) {
    const data = taskQueue[tag];
    if (data.task && data.obj) {
      if (!data.obj.aborted) {
        data.task.abort();
        data.obj.aborted = true;
      }
      waitRedoTask.push(data.obj);
    }
  }
}

function redoSessionTask() {
  if (!waitRedoTask || waitRedoTask.length === 0) return;
  
  for (const taskObj of waitRedoTask) {
    taskObj.aborted = false;
    requestHandler.request(taskObj);
  }
  waitRedoTask = [];
}

function delSessionTask(tag: string) {
  if (!taskQueue[tag]) {
    return; // tag不存在则直接返回
  }
  
  delete taskQueue[tag];
}


export default {
  addSessionTask,
  delSessionTask,
  abortSessionTask,
  redoSessionTask,
  setMaxQueueSize,
  getMaxQueueSize,
}