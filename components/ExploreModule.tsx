'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { modules, calculateArchetype } from '@/content/modules';

interface ExploreModuleProps {
  moduleId: string;
}

export default function ExploreModule({ moduleId }: ExploreModuleProps) {
  const router = useRouter();
  const module = modules[moduleId];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; optionId: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!module) {
    return (
      <div className="bg-cyber min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">模块不存在</p>
      </div>
    );
  }

  const currentQuestion = module.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === module.questions.length - 1;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [
      ...answers,
      { questionId: currentQuestion.id, optionId: selectedOption },
    ];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // 计算结果并跳转
      const archetypeId = calculateArchetype(moduleId, newAnswers);
      setIsTransitioning(true);

      setTimeout(() => {
        router.push(`/result?module=${moduleId}&archetype=${archetypeId}`);
      }, 800);
    } else {
      // 下一题
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <main className="bg-cyber min-h-screen">
      <div className="screen">
        <div className="max-w-xl mx-auto w-full px-4">
          {/* 模块标识 */}
          <div className="text-center mb-12">
            <p className="text-[var(--text-muted)] text-sm mb-2">
              {module.name} · {currentQuestionIndex + 1}/{module.questions.length}
            </p>
            <div className="flex justify-center gap-2 mb-8">
              {module.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${index <= currentQuestionIndex
                      ? 'bg-[var(--text-accent)]'
                      : 'bg-[var(--border-subtle)]'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* 问题 */}
          <div
            className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
          >
            <h2 className="text-xl md:text-2xl text-[var(--text-primary)] text-center mb-10 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* 选项 */}
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`option-cyber ${selectedOption === option.id ? 'selected' : ''} ${currentQuestionIndex > 0 ? 'deeper' : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>

            {/* 确认按钮 */}
            <div className="mt-10 text-center">
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`btn-cyber ${!selectedOption
                    ? 'opacity-30 cursor-not-allowed'
                    : ''
                  }`}
              >
                {isLastQuestion ? '查看结果' : '继续'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
