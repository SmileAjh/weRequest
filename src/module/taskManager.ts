import { IRequestOption } from "../interface"
import requestHandler from './requestHandler'
// 依赖登录态的请求队列逻辑，在发现登录态失效时及时进行abort，登录态生效之后重新请求

const taskQueue : any = {}; // 请求任务队列
let waitRedoTask : string[] = []; // 准备重新请求的队列，只存储 tag
let maxQueueSize = 100; // 队列最大长度限制，可通过配置修改
let isRedoing = false; // 标记是否正在执行重试任务
let isAborting = false; // 标记是否正在执行中断任务

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
  // 如果正在执行重试任务，说明登陆态已经有效，直接禁止 abort 操作
  if (isRedoing) {
    console.log('Abort operation is blocked during redo session task execution');
    return;
  }
  
  isAborting = true;
  
  try {
    waitRedoTask = [];
    
    // 获取当前所有 tag，避免遍历过程中的动态变化
    const tags = Object.keys(taskQueue);
    
    for (const tag of tags) {
      const data = taskQueue[tag];
      // 更严格的数据检查，确保数据完整性
      if (data && typeof data === 'object' && data.task && data.obj) {
        if (!data.obj.aborted) {
          data.task.abort();
          data.obj.aborted = true;
        }
        waitRedoTask.push(tag);
      }
    }
  } finally {
    isAborting = false;
  }
}

function redoSessionTask() {
  // 如果正在执行中断任务，直接禁止重试操作
  if (isAborting) {
    console.log('Redo operation is blocked during abort session task execution');
    return;
  }

  // 如果正在执行重试任务，直接禁止重试操作
  if (isRedoing) {
    console.log('Redo operation is blocked during redo session task execution');
    return;
  }
  
  if (!waitRedoTask || waitRedoTask.length === 0) return;
  
  isRedoing = true;
  
  try {
    // 创建当前等待重试任务的副本，避免被其他操作影响
    const currentWaitRedoTask = [...waitRedoTask];
    
    for (const tag of currentWaitRedoTask) {
      const data = taskQueue[tag];
      if (data && data.obj) {
        data.obj.aborted = false;
        requestHandler.request(data.obj);
        delSessionTask(tag);
      }
    }
  } finally {
    // 确保状态被重置
    isRedoing = false;
    waitRedoTask = [];
  }
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