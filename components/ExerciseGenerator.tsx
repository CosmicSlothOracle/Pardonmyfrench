import React, { useState } from 'react';
import { getStaticExams } from '../services/exerciseService';

interface Props {
  onSelectExam: (examId: number) => void;
  isGenerating: boolean; // Kept for interface compatibility though unused
}

export const ExerciseGenerator: React.FC<Props> = ({ onSelectExam }) => {
  const [selectedExamId, setSelectedExamId] = useState<number>(0);
  const exams = getStaticExams();

  const handleStart = () => {
    onSelectExam(selectedExamId);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-xl border-t-4 border-blue-600">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">Pardon My French</h1>
        <h2 className="text-xl text-gray-500 uppercase tracking-widest">Standardized Examination</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center">
            <i className="fas fa-file-alt mr-2"></i>
            Select Examination Module
          </h3>

          <div className="space-y-3">
             {exams.map((exam, index) => (
               <div
                 key={index}
                 onClick={() => setSelectedExamId(index)}
                 className={`p-4 rounded border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedExamId === index
                    ? 'border-blue-600 bg-white shadow-md'
                    : 'border-transparent bg-blue-100/50 hover:bg-blue-100'
                 }`}
               >
                  <div>
                    <span className="font-bold text-lg text-ink block">{exam.title}</span>
                    <span className="text-sm text-gray-600">{exam.topic}</span>
                  </div>
                  {selectedExamId === index && (
                    <i className="fas fa-check-circle text-blue-600 text-2xl"></i>
                  )}
               </div>
             ))}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800 border border-yellow-200">
          <i className="fas fa-shield-alt mr-2"></i>
          <strong>Anti-Cheat Aktiv:</strong> Das Verlassen des Fensters pausiert die Uhr und protokolliert den Vorfall. Kopieren/Einfügen ist deaktiviert. Screenshots werden überwacht.
        </div>

        <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-200">
          <i className="fas fa-info-circle mr-2"></i>
          <strong>Anweisungen:</strong> Schaue dir das Video genau an, dann vervollständige den Lückentext. Alle deine Aktionen werden zu Sicherheitszwecken protokolliert. Nimm dir Zeit und antworte durchdacht.
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform transition hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700"
        >
          <span>Begin Examination <i className="fas fa-arrow-right ml-2"></i></span>
        </button>
      </div>
    </div>
  );
};