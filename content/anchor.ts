// 临在之锚 - 情境数据
export interface Situation {
  id: string;
  label: string;              // 情境标签
}

export interface CognitiveStep {
  text: string;               // 拆解文本
}

export interface AnchorContent {
  id: string;
  situation: string;          // 关联的情境ID
  // 认知拆解页 - 流式展示的步骤
  cognitiveSteps: CognitiveStep[];
  // 重塑显现页
  oldNarrative: string;       // 旧叙事（灰字划线）
  newCognition: string;       // 新认知（高亮）
}

// 情境选项（情境入口页）- 体感化描述
export const situations: Situation[] = [
  { id: 'bracing', label: '我的肩膀一直耸着' },
  { id: 'blaming', label: '我在自责' },
  { id: 'exhausted', label: '我很疲惫，但停不下来' },
  { id: 'numb', label: '我感觉不到自己在呼吸' }
];

// 各情境对应的内容
export const anchorContents: Record<string, AnchorContent> = {
  bracing: {
    id: 'bracing',
    situation: 'bracing',
    cognitiveSteps: [
      { text: '你此刻的沉重，' },
      { text: '不是因为你做错了什么，' },
      { text: '而是你把「我很在意」' },
      { text: '误当成了\n「这必须由我来解决」。' }
    ],
    oldNarrative: '这件事必须由我负责',
    newCognition: '在意，不等于必须扛起来。'
  },

  blaming: {
    id: 'blaming',
    situation: 'blaming',
    cognitiveSteps: [
      { text: '你正在对自己说一些很重的话。' },
      { text: '这种声音，可能不是"事实"，\n而是一种旧的保护模式。' },
      { text: '在很早的时候，\n自责曾经帮你避开更大的惩罚。' },
      { text: '但现在，\n它已经不再是保护，而是消耗。' }
    ],
    oldNarrative: '都是我的问题',
    newCognition: '自责的声音，不是真相。'
  },

  exhausted: {
    id: 'exhausted',
    situation: 'exhausted',
    cognitiveSteps: [
      { text: '你已经很累了，\n但身体还在自动运行。' },
      { text: '这不是意志力，\n这是神经系统还没有接到"可以停"的信号。' },
      { text: '长期处于这种状态，\n系统会以为"停下=危险"。' },
      { text: '你需要的，不是更努力，\n而是一个明确的"可以停"的许可。' }
    ],
    oldNarrative: '再撑一下就好了',
    newCognition: '累了就是累了，不需要理由。'
  },

  numb: {
    id: 'numb',
    situation: 'numb',
    cognitiveSteps: [
      { text: '你感觉有点空，\n好像什么都没那么重要了。' },
      { text: '这种"麻"，是一种保护。\n系统在帮你降低能耗。' },
      { text: '不是你不在乎了，\n是你的感知被临时关闭了。' },
      { text: '此刻不需要"找回感觉"，\n只需要让这种状态被看见。' }
    ],
    oldNarrative: '我是不是出了什么问题',
    newCognition: '麻木是一种保护，不是缺陷。'
  }
};

// 价值声明页文案
export const valueStatement = {
  title: '',  // 不需要标题，文案本身足够大
  content: `这里不分析你是谁，
也不告诉你该成为什么。

如果你只是想在此刻站稳一下，可以从这里开始。`,
  buttonText: '我为自己而来'
};

// 余波安放页文案
export const aftercareContent = {
  title: '',
  message: '这一轮已经完成了',
  subtitle: '你不需要再继续停留，\n也不需要再处理任何东西。',
  // 回归现实的物理动作建议
  groundingActions: [
    '喝一口水',
    '站起来活动一下',
    '看一眼窗外或远处'
  ],
  mainAction: {
    id: 'back-to-life',
    label: '回到生活'
  },
  secondaryHint: '想留下一点记录？',
  secondaryAction: {
    id: 'save',
    label: '保存这次锚定'
  }
};
