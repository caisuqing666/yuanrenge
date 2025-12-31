// 5个人格反应原型
export interface Archetype {
  id: string;
  name: string;
  label: string;
  definition: string;
  identifyStatement: string;
  allowStatement: string;
  forbidden: string[]; // 禁止说的话
}

export const archetypes: Record<string, Archetype> = {
  carrier: {
    id: 'carrier',
    name: '扛着走的人',
    label: '当前反应模式',
    definition: '当一切开始变难时，TA的第一反应是：我来扛。',
    identifyStatement: '你不是没事，只是一直把"该扛的"放在自己这边。',
    allowStatement: '此刻不再继续扛，也不代表你做错了什么。',
    forbidden: ['你可以试着放下', '你已经很棒了', '你已经做得很好了']
  },

  overthinker: {
    id: 'overthinker',
    name: '反复纠结的人',
    label: '当前反应模式',
    definition: '当事情没有明确答案时，TA会反复推演、来回拉扯，试图找到"那个最不后悔的选项"。',
    identifyStatement: '你现在卡住的，不是选择本身，而是你太在意"会不会后悔"。',
    allowStatement: '现在不做决定，也是一种被允许的状态。',
    forbidden: ['别想太多', '相信直觉', '选哪个都一样']
  },

  sinking: {
    id: 'sinking',
    name: '情绪坠落的人',
    label: '当前反应模式',
    definition: '当压力超过承载阈值时，TA会整体下沉，情绪先于理性失控。',
    identifyStatement: '你不是想不开，是已经超出了自己能承受的范围。',
    allowStatement: '在这种负载下，什么都不做，是系统的自然反应。',
    forbidden: ['情绪会过去的', '想想为什么会这样', '振作起来']
  },

  rational: {
    id: 'rational',
    name: '强行理性的人',
    label: '当前反应模式',
    definition: '当感受变得不可控时，TA会迅速切换到理性模式，用分析压住情绪。',
    identifyStatement: '你现在用理性撑着，是因为一旦停下来，情绪就会失控。',
    allowStatement: '不继续分析，并不会让事情变得更糟。',
    forbidden: ['你应该多感受情绪', '不要压抑自己', '你在逃避']
  },

  shutdown: {
    id: 'shutdown',
    name: '什么都不想的人',
    label: '当前反应模式',
    definition: '当一切都显得过于耗能时，TA的系统会选择：直接关机。',
    identifyStatement: '你不是不在乎，是已经没有多余能量再处理任何事。',
    allowStatement: '现在什么都不回应，也是在保护自己。',
    forbidden: ['你要振作起来', '再坚持一下', '不要逃避']
  }
};
