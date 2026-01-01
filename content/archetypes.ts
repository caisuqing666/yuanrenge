// 5个人格反应原型 - 三层表达结构
export interface Archetype {
  id: string;
  name: string;
  label: string;
  // 三层表达
  meme: string;           // 玩梗版（入口层 · 让人点进来）
  identify: string;       // 识别版（中间层 · 让人对号入座）
  core: string;           // 元人格句（核心层 · 停住的那一刻）
  // 允许句
  allowStatement: string;
  // 禁止说的话
  forbidden: string[];
}

export const archetypes: Record<string, Archetype> = {
  // 收缩型（防御 / 退回 / 先自保）
  shrink: {
    id: 'shrink',
    name: '收缩型',
    label: '我知道了',
    meme: '你是不是那种：\n一觉得不对劲，就先把自己缩小的人？',
    identify: '当事情变复杂时，你更容易选择：\n少说一点、少要一点、先别添麻烦。',
    core: '你不是没想法，\n你只是太早进入了「自我保护模式」。',
    allowStatement: '先退一步，是允许的。',
    forbidden: ['你应该更主动', '别怕', '勇敢一点']
  },

  // 过载型（责任过多 / 扛太多 / 系统超负荷）
  overload: {
    id: 'overload',
    name: '过载型',
    label: '我知道了',
    meme: '你是不是那种：\n明明已经很累了，还在自动接任务的人？',
    identify: '当事情堆在一起时，你的第一反应不是拒绝，\n而是：「我先顶着。」',
    core: '你不是能者多劳，\n你只是一直没有把「不该你扛的」放回去。',
    allowStatement: '现在停下来，并不是放弃。',
    forbidden: ['你可以试着放下', '你已经很棒了', '你已经做得很好了']
  },

  // 僵住型（动不了 / 冻结 / 系统卡死）
  frozen: {
    id: 'frozen',
    name: '僵住型',
    label: '我知道了',
    meme: '你是不是那种：\n事情一多，反而什么都不想动的人？',
    identify: '当你说「我什么都不想」的时候，\n其实是系统已经过载，进入了暂停状态。',
    core: '你不是懒，\n你只是还没从上一轮消耗里恢复过来。',
    allowStatement: '什么都不做，是允许的。',
    forbidden: ['你要振作起来', '再坚持一下', '不要逃避']
  },

  // 拉扯型（内在冲突 / 左右互搏）
  conflict: {
    id: 'conflict',
    name: '拉扯型',
    label: '我知道了',
    meme: '你是不是那种：\n一边想前进，一边又在心里疯狂踩刹车的人？',
    identify: '你卡住，不是因为没方向，\n而是同时有两套声音在争夺控制权。',
    core: '此刻拉扯的，不是你，\n而是你体内的两种保护机制。',
    allowStatement: '暂时不做决定，是可以的。',
    forbidden: ['别想太多', '相信直觉', '选哪个都一样']
  },

  // 试探型（不敢确认 / 先走一步看看）
  explorer: {
    id: 'explorer',
    name: '试探型',
    label: '我知道了',
    meme: '你是不是那种：\n不太敢开始，但又忍不住先试一点的人？',
    identify: '你更习惯用「先试试」，\n来避免一次性做出决定。',
    core: '你不是不坚定，\n你只是在用试探，给自己留退路。',
    allowStatement: '先试一步，是可以的。',
    forbidden: ['你应该更果断', '别犹豫', '想好了再做']
  },

  // ===== 保留旧ID的兼容映射 =====
  // 用于 modules.ts 中的引用兼容
  carrier: {
    id: 'overload',
    name: '过载型',
    label: '我知道了',
    meme: '你是不是那种：\n明明已经很累了，还在自动接任务的人？',
    identify: '当事情堆在一起时，你的第一反应不是拒绝，\n而是：「我先顶着。」',
    core: '你不是能者多劳，\n你只是一直没有把「不该你扛的」放回去。',
    allowStatement: '现在停下来，并不是放弃。',
    forbidden: ['你可以试着放下', '你已经很棒了', '你已经做得很好了']
  },

  overthinker: {
    id: 'conflict',
    name: '拉扯型',
    label: '我知道了',
    meme: '你是不是那种：\n一边想前进，一边又在心里疯狂踩刹车的人？',
    identify: '你卡住，不是因为没方向，\n而是同时有两套声音在争夺控制权。',
    core: '此刻拉扯的，不是你，\n而是你体内的两种保护机制。',
    allowStatement: '暂时不做决定，是可以的。',
    forbidden: ['别想太多', '相信直觉', '选哪个都一样']
  },

  sinking: {
    id: 'shrink',
    name: '收缩型',
    label: '我知道了',
    meme: '你是不是那种：\n一觉得不对劲，就先把自己缩小的人？',
    identify: '当事情变复杂时，你更容易选择：\n少说一点、少要一点、先别添麻烦。',
    core: '你不是没想法，\n你只是太早进入了「自我保护模式」。',
    allowStatement: '先退一步，是允许的。',
    forbidden: ['你应该更主动', '别怕', '勇敢一点']
  },

  rational: {
    id: 'explorer',
    name: '试探型',
    label: '我知道了',
    meme: '你是不是那种：\n不太敢开始，但又忍不住先试一点的人？',
    identify: '你更习惯用「先试试」，\n来避免一次性做出决定。',
    core: '你不是不坚定，\n你只是在用试探，给自己留退路。',
    allowStatement: '先试一步，是可以的。',
    forbidden: ['你应该更果断', '别犹豫', '想好了再做']
  },

  shutdown: {
    id: 'frozen',
    name: '僵住型',
    label: '我知道了',
    meme: '你是不是那种：\n事情一多，反而什么都不想动的人？',
    identify: '当你说「我什么都不想」的时候，\n其实是系统已经过载，进入了暂停状态。',
    core: '你不是懒，\n你只是还没从上一轮消耗里恢复过来。',
    allowStatement: '什么都不做，是允许的。',
    forbidden: ['你要振作起来', '再坚持一下', '不要逃避']
  }
};
