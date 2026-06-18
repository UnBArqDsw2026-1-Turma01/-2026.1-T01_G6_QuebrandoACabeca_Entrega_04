import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Tutorial.css";

// Tipo para um passo do tutorial
interface TutorialStep {
  num: number;
  icon: string;
  title: string;
  description: string | React.ReactNode; // permite JSX
}

interface TutorialProps {
  steps?: TutorialStep[];
  finishRoute?: string;
  onBack?: () => void;
  onComplete?: () => void;
  onStepChange?: (stepIndex: number, step: TutorialStep) => void;
  allowSkip?: boolean;
  finishButtonText?: string;
}

// ── Passos padrão do tutorial (com explicação detalhada das estrelas) ──
const DEFAULT_STEPS: TutorialStep[] = [
  {
    num: 1,
    icon: "🎮",
    title: "Selecione um nível",
    description:
      "Escolha um dos níveis disponíveis. Cada nível tem uma imagem exclusiva. Você só pode avançar para o próximo nível após completar o anterior.",
  },
  {
    num: 2,
    icon: "🧩",
    title: "Monte as peças",
    description:
      "Arraste as peças do tray (parte inferior) para o tabuleiro. Uma peça só se encaixa na posição correta quando colocada exatamente no lugar certo. Use o indicador visual para ajudar.",
  },
  {
    num: 3,
    icon: "💡",
    title: "Use dicas com sabedoria",
    description:
      "Você tem um número limitado de dicas por partida (5 no Fácil, 3 no Médio, 1 no Difícil). Cada dica revela por 3 segundos onde uma peça deve ser colocada. Porém, cada dica usada reduz sua pontuação final em 1 estrela!",
  },
  {
    num: 4,
    icon: "⭐",
    title: "Como funcionam as estrelas?",
    description: (
      <div className="stars-explanation">
        <p>
          Ao final de cada partida, você recebe <strong>1 a 3 estrelas</strong> 
          com base na sua performance. O sistema funciona assim:
        </p>
        <ul>
          <li>
            <strong>Dificuldade base:</strong> Fácil começa com <strong>1</strong> estrela, 
            Médio com <strong>2</strong> e Difícil com <strong>3</strong>.
          </li>
          <li>
            <strong>Penalidade por dicas:</strong> Cada dica usada reduz <strong>-1</strong> estrela 
            (mínimo 1 estrela).
          </li>
          <li>
            <strong>Penalidade por timer desativado:</strong> Se você desligar o timer, 
             perde <strong>-1</strong> estrela (mínimo 1).
          </li>
        </ul>
        <div className="stars-max">
          🌟 Para conseguir <strong>3 estrelas</strong>, você precisa:
          <ul>
            <li>Jogar no <strong>Difícil</strong></li>
            <li><strong>Não usar nenhuma dica</strong></li>
            <li>Ter o <strong>timer ativo</strong> e o embaralhamento ligado</li>
          </ul>
        </div>
        <p style={{ marginTop: 8, color: 'var(--accent2)' }}>
          💡 Quanto mais estrelas, maior a pontuação no placar global!
        </p>
      </div>
    ),
  },
];

const Tutorial: React.FC<TutorialProps> = ({
  steps = DEFAULT_STEPS,
  finishRoute = "/selecao-nivel",
  onBack,
  onComplete,
  onStepChange,
  allowSkip = false,
  finishButtonText = "🎮 Começar a jogar",
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep, steps[currentStep]);
    }
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep, steps, onStepChange]);

  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStep(index);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      if (onComplete) {
        onComplete();
      } else {
        navigate(finishRoute);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/menu");
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate(finishRoute);
    }
  };

  const renderDots = () => (
    <div className="tutorial-dots">
      {steps.map((_, index) => (
        <div
          key={index}
          className={`tutorial-dot ${currentStep === index ? "active" : ""}`}
          onClick={() => goToStep(index)}
        />
      ))}
    </div>
  );

  const renderSteps = () => {
    const visibleSteps = steps.slice(0, currentStep + 1);

    return (
      <div className="tutorial-step-container" ref={containerRef}>
        {visibleSteps.map((step, idx) => {
          const isActive = idx === currentStep;
          return (
            <div
              key={step.num}
              className={`tutorial-step-card ${!isActive ? "inactive" : ""}`}
            >
              <div
                className="tutorial-step-num"
                style={!isActive ? { background: "var(--border)" } : {}}
              >
                {step.num}
              </div>
              <div className="tutorial-step-content">
                <h3>{step.title}</h3>
                <div className="tutorial-step-description">
                  {typeof step.description === "string" ? (
                    <p>{step.description}</p>
                  ) : (
                    step.description
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="tutorial-step-illustration">
          {steps[currentStep].icon}
        </div>
      </div>
    );
  };

  const renderActions = () => (
    <div className="tutorial-actions">
      <button
        className="tutorial-btn tutorial-btn-secondary"
        onClick={handlePrev}
        disabled={currentStep === 0}
      >
        ← Anterior
      </button>
      <button
        className={`tutorial-btn ${isLastStep ? "tutorial-btn-success" : "tutorial-btn-primary"}`}
        onClick={handleNext}
      >
        {isLastStep ? finishButtonText : "Próximo →"}
      </button>
    </div>
  );

  return (
    <div className="tutorial-page">
      <header className="tutorial-header">
        <div className="tutorial-logo">
          📖 Tutorial
          {allowSkip && (
            <span className="tutorial-badge-warn" onClick={handleSkip}>
              Pular
            </span>
          )}
        </div>
        <button className="tutorial-back" onClick={handleBack}>
          ← Menu
        </button>
      </header>

      <main className="tutorial-content">
        <div className="tutorial-container">
          {renderDots()}
          {renderSteps()}
          {renderActions()}
        </div>
      </main>
    </div>
  );
};

export default Tutorial;