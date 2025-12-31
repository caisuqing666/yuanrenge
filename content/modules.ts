// 3个入口模块的问题设计
export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    archetype: string; // 指向的原型ID
  }[];
}

export interface Module {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  questions: Question[];
  // 候选原型池
  primaryArchetypes: string[];
  secondaryArchetypes: string[];
  // 平局时的优先级
  tiebreaker: string[];
}

export const modules: Record<string, Module> = {
  hesitation: {
    id: 'hesitation',
    name: '犹豫',
    subtitle: '卡在选择里',
    description: '行动被卡住，但认知仍在高速运转',
    primaryArchetypes: ['carrier', 'overthinker'],
    secondaryArchetypes: ['rational'],
    tiebreaker: ['overthinker', 'carrier', 'rational'],
    questions: [
      {
        id: 'h1',
        text: '你现在卡住的，更像哪一种？',
        options: [
          { id: 'h1a', text: '选哪个都会影响别人', archetype: 'carrier' },
          { id: 'h1b', text: '总觉得再想想会更稳妥', archetype: 'overthinker' },
          { id: 'h1c', text: '明明很累，但还是得继续', archetype: 'carrier' },
          { id: 'h1d', text: '说不清为什么，就是动不了', archetype: 'sinking' }
        ]
      },
      {
        id: 'h2',
        text: '当你想到"万一选错了"，第一反应更接近？',
        options: [
          { id: 'h2a', text: '先算清楚，尽量别出错', archetype: 'rational' },
          { id: 'h2b', text: '自己多承担一点就好', archetype: 'carrier' },
          { id: 'h2c', text: '情绪一下子就上来了', archetype: 'sinking' },
          { id: 'h2d', text: '不想再想了', archetype: 'shutdown' }
        ]
      }
    ]
  },

  emotional: {
    id: 'emotional',
    name: '情绪乱',
    subtitle: '有点接不住',
    description: '情绪信号强于认知控制',
    primaryArchetypes: ['sinking'],
    secondaryArchetypes: ['carrier', 'rational', 'overthinker', 'shutdown'],
    tiebreaker: ['sinking', 'carrier', 'rational'],
    questions: [
      {
        id: 'e1',
        text: '此刻对你影响最大的，是哪一层？',
        options: [
          { id: 'e1a', text: '情绪已经压过理性', archetype: 'sinking' },
          { id: 'e1b', text: '身体明显吃不消了', archetype: 'carrier' },
          { id: 'e1c', text: '脑子停不下来', archetype: 'rational' },
          { id: 'e1d', text: '其实什么都不想处理', archetype: 'shutdown' }
        ]
      },
      {
        id: 'e2',
        text: '你现在更像在做哪件事？',
        options: [
          { id: 'e2a', text: '硬撑着不让自己垮', archetype: 'carrier' },
          { id: 'e2b', text: '拼命想把事情想明白', archetype: 'rational' },
          { id: 'e2c', text: '什么都不想干', archetype: 'shutdown' },
          { id: 'e2d', text: '已经有点接不住了', archetype: 'sinking' }
        ]
      }
    ]
  },

  shutdown: {
    id: 'shutdown',
    name: '什么都不想',
    subtitle: '系统低电量',
    description: '系统主动降载，进入最低能耗模式',
    primaryArchetypes: ['shutdown'],
    secondaryArchetypes: ['sinking', 'carrier'],
    tiebreaker: ['shutdown', 'sinking', 'carrier'],
    questions: [
      {
        id: 's1',
        text: '你现在的状态更接近？',
        options: [
          { id: 's1a', text: '彻底没电了', archetype: 'shutdown' },
          { id: 's1b', text: '不想回应任何事', archetype: 'shutdown' },
          { id: 's1c', text: '有点情绪，但懒得处理', archetype: 'sinking' },
          { id: 's1d', text: '只是暂时不想动', archetype: 'carrier' }
        ]
      },
      {
        id: 's2',
        text: '如果现在必须面对一件事，你会？',
        options: [
          { id: 's2a', text: '完全不想碰', archetype: 'shutdown' },
          { id: 's2b', text: '会烦躁或低落', archetype: 'sinking' },
          { id: 's2c', text: '先拖着再说', archetype: 'shutdown' },
          { id: 's2d', text: '勉强分析一下', archetype: 'rational' }
        ]
      }
    ]
  }
};

// 根据答案计算最终原型
export function calculateArchetype(
  moduleId: string,
  answers: { questionId: string; optionId: string }[]
): string {
  const module = modules[moduleId];
  if (!module) return 'carrier'; // fallback

  // 计算每个原型的命中次数
  const hits: Record<string, number> = {};

  for (const answer of answers) {
    const question = module.questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    const option = question.options.find(o => o.id === answer.optionId);
    if (!option) continue;

    hits[option.archetype] = (hits[option.archetype] || 0) + 1;
  }

  // 找出命中最多的原型
  let maxHits = 0;
  let topArchetypes: string[] = [];

  for (const [archetype, count] of Object.entries(hits)) {
    if (count > maxHits) {
      maxHits = count;
      topArchetypes = [archetype];
    } else if (count === maxHits) {
      topArchetypes.push(archetype);
    }
  }

  // 如果只有一个最高，直接返回
  if (topArchetypes.length === 1) {
    return topArchetypes[0];
  }

  // 平局时，按入口的优先级决定
  for (const archetype of module.tiebreaker) {
    if (topArchetypes.includes(archetype)) {
      return archetype;
    }
  }

  // 兜底
  return module.tiebreaker[0] || 'carrier';
}
