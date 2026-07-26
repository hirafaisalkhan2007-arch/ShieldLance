import React, { useState } from "react";
import { HelpCircle, CheckCircle2, AlertTriangle, RotateCcw, ShieldAlert, Award } from "lucide-react";
import { SAFETY_QUIZ } from "../data/scamPatterns";

export const SafetyQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [totalRiskScore, setTotalRiskScore] = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState<boolean[]>(new Array(SAFETY_QUIZ.length).fill(false));
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = SAFETY_QUIZ[currentStep];

  const handleSelectOption = (idx: number) => {
    if (answersSubmitted[currentStep]) return;
    setSelectedOptionIndex(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOptionIndex === null) return;

    const chosenOption = question.options[selectedOptionIndex];
    setTotalRiskScore((prev) => prev + chosenOption.score);

    const updatedAnswers = [...answersSubmitted];
    updatedAnswers[currentStep] = true;
    setAnswersSubmitted(updatedAnswers);
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    if (currentStep < SAFETY_QUIZ.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentStep(0);
    setSelectedOptionIndex(null);
    setTotalRiskScore(0);
    setAnswersSubmitted(new Array(SAFETY_QUIZ.length).fill(false));
    setQuizCompleted(false);
  };

  const getSafetyBadge = (score: number) => {
    if (score === 0) {
      return {
        title: "Master Scam Spotter 🛡️",
        desc: "You have sharp instincts! You correctly identify red flags and enforce safe freelancer boundaries.",
        color: "text-emerald-800 bg-emerald-50 border-emerald-200",
      };
    } else if (score <= 25) {
      return {
        title: "Cautious Freelancer ⚠️",
        desc: "You caught most red flags, but watch out for subtle traps like fake checks and off-platform moves.",
        color: "text-amber-800 bg-amber-50 border-amber-200",
      };
    } else {
      return {
        title: "High Scam Exposure Risk 🚨",
        desc: "Be very careful! Scammers target freelancers willing to pay fees, take fake checks, or work off-platform.",
        color: "text-red-800 bg-red-50 border-red-200",
      };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Freelance Safety Test & Knowledge Exam
          </h2>
        </div>

        {!quizCompleted && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
            Scenario {currentStep + 1} of {SAFETY_QUIZ.length}
          </span>
        )}
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Question context & title */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Scenario #{question.id}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {question.question}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
              Context: {question.context}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isSubmitted = answersSubmitted[currentStep];

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 font-bold text-indigo-900 shadow-2xs"
                      : "border-slate-200 bg-white hover:border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                  </div>

                  {/* Feedback on answer submission */}
                  {isSubmitted && isSelected && (
                    <div className="mt-3 pt-3 border-t border-indigo-200 text-xs font-normal space-y-1">
                      <div className="font-bold flex items-center space-x-1">
                        {opt.score === 0 ? (
                          <span className="text-emerald-700 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Safe Decision! (+0 Risk)</span>
                          </span>
                        ) : (
                          <span className="text-red-700 flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Risky Choice (+{opt.score} Risk Points)</span>
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600">{opt.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {!answersSubmitted[currentStep] ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOptionIndex === null}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
              >
                Confirm Choice
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                {currentStep < SAFETY_QUIZ.length - 1 ? "Next Question →" : "View Final Score"}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Safety Test Completed</h3>
            <p className="text-xs text-slate-500">Your total vulnerability risk score across 5 real-world scenarios:</p>
            <div className="text-4xl font-black text-indigo-600 my-2">{totalRiskScore} Risk Points</div>
          </div>

          {/* Badge Result */}
          {(() => {
            const badge = getSafetyBadge(totalRiskScore);
            return (
              <div className={`p-5 rounded-xl border max-w-md mx-auto text-left space-y-2 ${badge.color}`}>
                <div className="font-extrabold text-sm">{badge.title}</div>
                <p className="text-xs leading-relaxed">{badge.desc}</p>
              </div>
            );
          })()}

          <button
            onClick={handleResetQuiz}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Safety Test</span>
          </button>
        </div>
      )}
    </div>
  );
};
