import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Tutorial.css";

// Tipo para um passo do tutorial
interface TutorialStep {
  num: number;
  icon: string;
  title: string;
  description: string;
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

// Passos padrão do tutorial
const DEFAULT_STEPS: TutorialStep[] = [
  {
    num: 1,
    icon: "🎮",
    title: "Selecione um nível",
    description:
      "Escolha a dificuldade e o nível no menu 'Jogar'. Você pode filtrar por Fácil, Médio ou Difícil.",
  },
  {
    num: 2,
    icon: "🧩",
    title: "Monte as peças",
    description:
      "Arraste e solte as peças na posição correta. As peças se encaixam automaticamente quando próximas.",
  },
  {
    num: 3,
    icon: "💡",
    title: "Use dicas com sabedoria",
    description:
      "Você tem um número limitado de dicas por partida. Elas revelam onde uma peça deve ser colocada.",
  },
  {
    num: 4,
    icon: "🏆",
    title: "Conquiste estrelas",
    description:
      "Complete o quebra-cabeça rapidamente e sem dicas para ganhar 3 estrelas e subir no placar!",
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
                <p>{step.description}</p>
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