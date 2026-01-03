'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  situations,
  anchorContents,
  valueStatement,
  aftercareContent
} from '@/content/anchor';

// 6个页面状态
type AnchorStage =
  | 'value'      // ① 价值声明页
  | 'situation'  // ② 情境入口页
  | 'presence'   // ③ 感知交互页
  | 'cognitive'  // ④ 认知拆解页
  | 'reframe'    // ⑤ 重塑显现页
  | 'aftercare'; // ⑥ 余波安放页

export default function AnchorPage() {
  const [stage, setStage] = useState<AnchorStage>('value');
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [cognitiveStep, setCognitiveStep] = useState(0);
  const [showNewCognition, setShowNewCognition] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 获取当前情境的内容
  const currentContent = selectedSituation
    ? anchorContents[selectedSituation]
    : null;

  // 页面切换（带过渡动画）
  const transitionTo = useCallback((nextStage: AnchorStage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(nextStage);
      setIsTransitioning(false);
    }, 400);
  }, []);

  // ① 价值声明页
  const ValuePage = () => (
    <div className="anchor-page">
      <div className="anchor-content text-center max-w-lg">
        <div className="value-statement mb-20">
          {valueStatement.content.split('\n').map((line, i) => (
            <p
              key={i}
              className={`text-xl md:text-2xl leading-loose mb-1 ${
                line ? 'text-[var(--text-secondary)]' : 'h-6'
              }`}
            >
              {line || '\u00A0'}
            </p>
          ))}
        </div>
        <button
          onClick={() => transitionTo('situation')}
          className="anchor-btn-primary"
        >
          {valueStatement.buttonText}
        </button>
        <p className="text-xs text-[var(--text-muted)] mt-6 opacity-60">
          此过程大约需要 3 分钟，这段时间只属于你。
        </p>
      </div>
    </div>
  );

  // ② 情境入口页
  const SituationPage = () => (
    <div className="anchor-page">
      <div className="anchor-content">
        <p className="text-center text-[var(--text-muted)] text-sm mb-12">
          此刻，哪个状态最接近你？
        </p>
        <div className="space-y-4 max-w-md mx-auto">
          {situations.map((sit) => (
            <button
              key={sit.id}
              onClick={() => {
                setSelectedSituation(sit.id);
                transitionTo('presence');
              }}
              className="situation-option"
            >
              {sit.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ③ 感知交互页（核心）- 长按呼吸交互
  const PresencePage = () => {
    const [isPressing, setIsPressing] = useState(false);
    const [breathCount, setBreathCount] = useState(0);
    const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'exhale'>('idle');
    const pressStartTime = useState<number>(0);

    // 长按开始 - 吸气（光圈收缩）
    const handlePressStart = useCallback(() => {
      setIsPressing(true);
      setBreathPhase('inhale');
      // 轻微震动反馈
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }, []);

    // 长按结束 - 呼气（光圈扩张）
    const handlePressEnd = useCallback(() => {
      if (isPressing) {
        setIsPressing(false);
        setBreathPhase('exhale');

        // 计数一次完整呼吸
        const newCount = breathCount + 1;
        setBreathCount(newCount);

        // 轻微震动反馈
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }

        // 完成3次呼吸后进入下一页
        if (newCount >= 3) {
          setTimeout(() => {
            if (navigator.vibrate) {
              navigator.vibrate(50);
            }
            transitionTo('cognitive');
          }, 1000);
        } else {
          // 呼气结束后回到idle
          setTimeout(() => {
            setBreathPhase('idle');
          }, 2000);
        }
      }
    }, [isPressing, breathCount, transitionTo]);

    const isComplete = breathCount >= 3;

    return (
      <div className="anchor-page presence-page">
        <div className="anchor-content text-center">
          {/* 呼吸光圈 - 响应长按 */}
          <div
            className="breathing-circle-container mb-12"
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
          >
            <div className={`breathing-circle-interactive ${breathPhase}`}></div>
          </div>

          {/* 引导文案 */}
          <div className="presence-text mb-8">
            {breathCount === 0 && breathPhase === 'idle' && (
              <>
                <p className="text-lg text-[var(--text-secondary)] mb-2">
                  长按光圈，缓慢吸气
                </p>
                <p className="text-lg text-[var(--text-secondary)]">
                  松开，缓慢呼气
                </p>
              </>
            )}
            {breathPhase === 'inhale' && (
              <p className="text-lg text-[var(--text-primary)]">
                吸气...
              </p>
            )}
            {breathPhase === 'exhale' && (
              <p className="text-lg text-[var(--text-primary)]">
                呼气...
              </p>
            )}
            {breathCount > 0 && breathPhase === 'idle' && !isComplete && (
              <p className="text-lg text-[var(--text-secondary)]">
                再来 {3 - breathCount} 次
              </p>
            )}
            {isComplete && (
              <p className="text-lg text-[var(--text-primary)]">
                我在这里了
              </p>
            )}
          </div>

          {/* 呼吸计数指示 */}
          <div className="flex justify-center gap-3 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`breath-dot ${i < breathCount ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ④ 认知拆解页（流式）
  const CognitivePage = () => {
    const steps = currentContent?.cognitiveSteps || [];
    const currentStep = steps[cognitiveStep];
    const isLastStep = cognitiveStep >= steps.length - 1;

    return (
      <div className="anchor-page cognitive-page">
        <div className="anchor-content text-center">
          {/* 静态微光圆点（视觉锚） */}
          <div className="cognitive-anchor-dot mb-16"></div>

          {/* 流式文本 */}
          <div className="cognitive-text-container">
            {currentStep && (
              <p className="cognitive-text">
                {currentStep.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < currentStep.text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
          </div>

          {/* 继续按钮 */}
          <button
            onClick={() => {
              if (isLastStep) {
                transitionTo('reframe');
              } else {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCognitiveStep(cognitiveStep + 1);
                  setIsTransitioning(false);
                }, 300);
              }
            }}
            className="anchor-btn-subtle mt-16"
          >
            {isLastStep ? '继续' : '下一步'}
          </button>
        </div>
      </div>
    );
  };

  // ⑤ 重塑显现页
  const ReframePage = () => {
    useEffect(() => {
      // 延迟显示新认知
      const timer = setTimeout(() => {
        setShowNewCognition(true);
      }, 800);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="anchor-page reframe-page">
        <div className="anchor-content text-center">
          {/* 旧叙事（灰字划线） */}
          <p className="old-narrative mb-8">
            {currentContent?.oldNarrative}
          </p>

          {/* 新认知（高亮但克制） */}
          <p className={`new-cognition ${showNewCognition ? 'visible' : ''}`}>
            {currentContent?.newCognition}
          </p>

          {/* 确认按钮 */}
          <button
            onClick={() => transitionTo('aftercare')}
            className="anchor-btn-subtle mt-16"
          >
            我知道了
          </button>
        </div>
      </div>
    );
  };

  // ⑥ 余波安放页（Aftercare）
  const AftercarePage = () => (
    <div className="anchor-page aftercare-page min-h-screen flex flex-col">
      <div className="anchor-content text-center max-w-lg mx-auto flex-1 flex flex-col">
        {/* 上半屏：内容区 - 留更多空白，让用户"看完 → 停一下" */}
        <div className="flex-1 flex flex-col justify-center pt-20 pb-8">
          {/* 主标题 */}
          <div className="aftercare-message mb-8">
            <p className="text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed mb-4">
              {aftercareContent.message}
            </p>
          </div>

          {/* 副标题 */}
          {aftercareContent.subtitle && (
            <div className="mb-12">
              {aftercareContent.subtitle.split('\n').map((line, i) => (
                <p key={i} className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-2">
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* 离开前的建议 */}
          {aftercareContent.groundingActions && aftercareContent.groundingActions.length > 0 && (
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                离开前，做一件很小的事：
              </p>
              <ul className="space-y-3 text-left max-w-xs mx-auto">
                {aftercareContent.groundingActions.map((action, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex items-center">
                    <span className="text-[var(--text-muted)] mr-3">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 下半屏：操作区 - 按钮靠下，引导"往下 → 离开"的动作 */}
        <div className="mt-auto pb-12 pt-16">
          {/* 主要操作：回到生活 - 视觉上更突出，引导离开动作 */}
          {aftercareContent.mainAction && (
            <div className="mb-8">
              <Link
                href="/"
                className="anchor-btn-primary block w-full max-w-xs mx-auto"
              >
                {aftercareContent.mainAction.label}
              </Link>
            </div>
          )}

          {/* 次要操作：保存锚定 */}
          {aftercareContent.secondaryHint && aftercareContent.secondaryAction && (
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] mb-3 opacity-60">
                {aftercareContent.secondaryHint}
              </p>
              <button
                onClick={() => {
                  // TODO: 实现保存功能
                  console.log('Action:', aftercareContent.secondaryAction?.id);
                }}
                className="text-xs text-[var(--text-muted)] opacity-60 hover:opacity-80 transition-opacity underline"
              >
                {aftercareContent.secondaryAction.label} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 渲染当前页面
  const renderStage = () => {
    switch (stage) {
      case 'value':
        return <ValuePage />;
      case 'situation':
        return <SituationPage />;
      case 'presence':
        return <PresencePage />;
      case 'cognitive':
        return <CognitivePage />;
      case 'reframe':
        return <ReframePage />;
      case 'aftercare':
        return <AftercarePage />;
      default:
        return <ValuePage />;
    }
  };

  return (
    <main className="anchor-container">
      <div className={`anchor-stage ${isTransitioning ? 'transitioning' : ''}`}>
        {renderStage()}
      </div>
    </main>
  );
}
