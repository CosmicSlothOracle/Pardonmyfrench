import React, { useState, useCallback, useEffect } from 'react';
import { AppState, GeneratedExercise, UserAnswer, ClozeGap, SecurityIncident, KeystrokeEvent, KeystrokeAnalysis } from './types';
import { getExamById } from './services/exerciseService';
import { AntiCheatWrapper } from './components/AntiCheatWrapper';
import { Timer } from './components/Timer';
import { ExerciseGenerator } from './components/ExerciseGenerator';
import { KeystrokeLogger } from './components/KeystrokeLogger';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const EXAM_COMPLETED_KEY = 'pardon-my-french:exam-completed';
const EXAM_START_KEY = 'pardon-my-french:exam-start';

// Helper function to normalize text by removing accents for comparison
// Accents are not considered in grading - only the base letters matter
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD') // Decompose characters (é -> e + ´)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase()
    .trim();
};

export default function App() {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [extraAnswer, setExtraAnswer] = useState("");
  const [sectionAnswers, setSectionAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [focusLostCount, setFocusLostCount] = useState(0);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);
  const [keystrokeEvents, setKeystrokeEvents] = useState<KeystrokeEvent[]>([]);
  const [keystrokeAnalysis, setKeystrokeAnalysis] = useState<KeystrokeAnalysis | null>(null);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examStartTimestamp, setExamStartTimestamp] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCompleted = window.localStorage.getItem(EXAM_COMPLETED_KEY);
      const completed = storedCompleted === '1';
      setIsExamCompleted(completed);

      const storedStart = window.localStorage.getItem(EXAM_START_KEY);
      if (storedStart) {
        const start = Number(storedStart);
        if (!Number.isNaN(start)) {
          setExamStartTimestamp(start);
          if (!completed) {
            const data = getExamById(0);
            setExercise(data);
            setState(AppState.TESTING);
            const elapsed = Math.floor((Date.now() - start) / 1000);
            setTimeElapsed(elapsed);
          }
        }
      }
    }
  }, []);

  const markExamCompleted = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(EXAM_COMPLETED_KEY, '1');
      window.localStorage.removeItem(EXAM_START_KEY);
    }
    setIsExamCompleted(true);
    setExamStartTimestamp(null);
  }, []);

  const handleSelectExam = (examId: number) => {
    if (isExamCompleted || examStartTimestamp) {
      return;
    }
    // Load static exam immediately
    const data = getExamById(examId);
    setExercise(data);
    setAnswers([]);
    setExtraAnswer("");
    setSectionAnswers({});
    setTimeElapsed(0);
    setFocusLostCount(0);
    setSecurityIncidents([]);
    setKeystrokeEvents([]);
    setKeystrokeAnalysis(null);
    setState(AppState.WATCHING);
  };

  const handleStartTest = () => {
    if (isExamCompleted) return;
    if (!examStartTimestamp) {
      const start = Date.now();
      setExamStartTimestamp(start);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(EXAM_START_KEY, start.toString());
      }
      setTimeElapsed(0);
    }
    setState(AppState.TESTING);
  };

  const handleAnswerChange = (gapId: number, value: string) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.gapId !== gapId);
      return [...filtered, { gapId, value }];
    });
  };

  const handleSectionAnswerChange = (sectionId: string, value: string) => {
    setSectionAnswers(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (state !== AppState.RESULTS) {
      if (window.confirm("Are you sure you want to finish the test?")) {
        setState(AppState.RESULTS);
        markExamCompleted();
      }
    }
  };

  const handleTimeExpired = () => {
    if (state !== AppState.RESULTS) {
      window.alert("Die Zeit ist abgelaufen! Die Klausur wird automatisch abgegeben.");
      setState(AppState.RESULTS);
      markExamCompleted();
    }
  };

  const handleFocusLost = useCallback(() => {
    setFocusLostCount(c => c + 1);
  }, []);

  const handleSecurityIncident = useCallback((incident: SecurityIncident) => {
    setSecurityIncidents(prev => [...prev, incident]);
  }, []);

  const handleKeystrokeUpdate = useCallback((events: KeystrokeEvent[], analysis: KeystrokeAnalysis) => {
    setKeystrokeEvents(events);
    setKeystrokeAnalysis(analysis);
  }, []);

  const downloadPDF = async () => {
    if (!exercise) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("Pardon My French", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(16);
    doc.text("Examination Results", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Student: Niece`, margin, 45);
    doc.text(`Level: Grade 9`, margin, 52);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 59);
    doc.text(`Time Taken: ${Math.floor(timeElapsed / 60)}m ${timeElapsed % 60}s`, margin, 66);
    doc.text(`Focus Lost: ${focusLostCount} times`, margin, 73);
    doc.text(`Security Incidents: ${securityIncidents.length}`, margin, 80);

    // Score
    let correctCount = 0;
    let totalGaps = 0;

    exercise.segments.forEach(seg => {
        if (seg.type === 'gap') {
            totalGaps++;
            const gap = seg.content as ClozeGap;
            const userAns = answers.find(a => a.gapId === gap.id)?.value || "";
            if (normalizeText(userAns) === normalizeText(gap.originalWord)) {
                correctCount++;
            }
        }
    });

    doc.setFont("helvetica", "bold");
    doc.text(`Score: ${correctCount} / ${totalGaps}`, margin, 87);

    // Content
    doc.setFontSize(14);
    doc.text("Exercise: " + exercise.title, margin, 102);

    let yPos = 112;
    doc.setFontSize(11);
    doc.setFont("times", "normal");

    // Corrections
    doc.text("Corrections:", margin, yPos);
    yPos += 10;

    exercise.segments.forEach(seg => {
      if (seg.type === 'gap') {
        const gap = seg.content as ClozeGap;
        const userAns = answers.find(a => a.gapId === gap.id)?.value || "(no answer)";
        const isCorrect = normalizeText(userAns) === normalizeText(gap.originalWord);

        const line = `Gap ${gap.id + 1} (${gap.hint}): ${userAns} -> ${isCorrect ? 'CORRECT' : `INCORRECT (Ans: ${gap.originalWord})`}`;

        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }

        doc.setTextColor(isCorrect ? 0 : 200, isCorrect ? 100 : 0, 0);
        doc.text(line, margin + 5, yPos);
        doc.setTextColor(0,0,0);
        yPos += 7;
      }
    });

    // Extra Question Result
    yPos += 10;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    if (exercise.extraQuestion) {
        doc.setFont("helvetica", "bold");
        doc.text("Video Comprehension Question:", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        doc.text(`Q: ${exercise.extraQuestion.question}`, margin, yPos);
        yPos += 7;
        doc.text(`Your Answer: ${extraAnswer || "(none)"}`, margin, yPos);
        yPos += 7;
        doc.text(`Model Answer: ${exercise.extraQuestion.answer}`, margin, yPos);
    }

    // Keystroke Analysis Section
    yPos += 15;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    if (keystrokeAnalysis && keystrokeEvents.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Keystroke Analysis & Behavioral Data", margin, yPos);
      yPos += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Keystrokes: ${keystrokeAnalysis.totalKeystrokes}`, margin, yPos);
      yPos += 6;
      doc.text(`Typing Speed: ${keystrokeAnalysis.wordsPerMinute} WPM`, margin, yPos);
      yPos += 6;
      doc.text(`Average Pause Duration: ${Math.round(keystrokeAnalysis.averagePauseDuration)}ms`, margin, yPos);
      yPos += 6;
      doc.text(`Backspace Count: ${keystrokeAnalysis.backspaceCount}`, margin, yPos);
      yPos += 6;
      doc.text(`Delete Count: ${keystrokeAnalysis.deleteCount}`, margin, yPos);
      yPos += 6;
      doc.text(`Correction Frequency: ${keystrokeAnalysis.correctionFrequency}%`, margin, yPos);
      yPos += 8;

      // Time per gap
      if (keystrokeAnalysis.timePerGap.size > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Time Spent per Gap:", margin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        keystrokeAnalysis.timePerGap.forEach((time, gapId) => {
          const seconds = Math.round(time / 1000);
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`Gap ${gapId + 1}: ${seconds}s`, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 5;
      }

      // Suspicious patterns
      if (keystrokeAnalysis.suspiciousPatterns.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 0, 0);
        doc.text("Suspicious Patterns Detected:", margin, yPos);
        yPos += 6;
        doc.setFont("helvetica", "normal");
        keystrokeAnalysis.suspiciousPatterns.forEach(pattern => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${pattern}`, margin + 5, yPos);
          yPos += 5;
        });
        doc.setTextColor(0, 0, 0);
        yPos += 5;
      }

      // Detailed Keystroke Log
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Detailed Keystroke Log", margin, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Timestamp | Key | Input ID | Value | Modifiers", margin, yPos);
      yPos += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 3;

      // Show first 100 keystrokes to avoid PDF size issues
      const logToShow = keystrokeEvents.slice(0, 100);
      logToShow.forEach((event, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
        }
        const timeStr = new Date(event.timestamp).toLocaleTimeString();
        const keyDisplay = event.isBackspace ? 'BS' : event.isDelete ? 'DEL' : event.key.length > 1 ? event.key : event.key;
        const modifiers = [
          event.modifiers.ctrl ? 'Ctrl' : '',
          event.modifiers.shift ? 'Shift' : '',
          event.modifiers.alt ? 'Alt' : '',
          event.modifiers.meta ? 'Meta' : ''
        ].filter(Boolean).join('+') || 'None';
        const valuePreview = event.inputValue.length > 20
          ? event.inputValue.substring(0, 20) + '...'
          : event.inputValue || '(empty)';

        doc.text(`${timeStr} | ${keyDisplay} | Gap ${event.inputId !== undefined ? event.inputId + 1 : 'N/A'} | "${valuePreview}" | ${modifiers}`, margin, yPos);
        yPos += 4;
      });

      if (keystrokeEvents.length > 100) {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont("helvetica", "italic");
        doc.text(`... and ${keystrokeEvents.length - 100} more keystrokes (truncated for PDF size)`, margin, yPos);
        yPos += 5;
      }
    }

    // Security Incidents Log
    if (securityIncidents.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(200, 0, 0);
      doc.text("Security Incidents Log", margin, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      securityIncidents.forEach((incident, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const timeStr = new Date(incident.timestamp).toLocaleTimeString();
        doc.text(`${timeStr} - [${incident.type.toUpperCase()}] ${incident.details}`, margin, yPos);
        yPos += 5;
      });
      doc.setTextColor(0, 0, 0);
    }

    // Get PDF as Uint8Array
    const pdfBytes = doc.output('arraybuffer');

    try {
      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Set metadata
      pdfDoc.setTitle('Pardon My French - Examination Results');
      pdfDoc.setAuthor('Pardon My French');
      pdfDoc.setSubject('French Cloze Test Results');

      // Note: pdf-lib version 1.17.1 doesn't directly support user password in browser
      // For actual password protection, we would need server-side processing
      // or specialized commercial libraries like Aspose.PDF
      // For now, we save the PDF without password protection
      const encryptedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: false,
      });

      // Create a blob and download
      const blob = new Blob([encryptedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pardon_my_french_results.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('PDF erstellt erfolgreich.');
    } catch (error) {
      console.error('Error creating PDF:', error);
      // Fallback: save without password if encryption fails
      doc.save("pardon_my_french_results.pdf");
    }
  };

  const renderWatching = () => {
    return (
      <div className="max-w-4xl mx-auto mt-8 mb-20 p-6 bg-paper shadow-2xl rounded-lg border border-gray-300">
        <h2 className="text-2xl font-serif font-bold text-ink mb-4 text-center">Video Phase</h2>
        <div className="text-center text-gray-600 mb-6">
          <p className="mb-2">Schaue dir das Video genau an. Der Test basiert auf dem Inhalt des Videos.</p>
          <p className="text-sm text-red-500 font-bold mb-2">Die Uhr startet, wenn du mit dem Test beginnst.</p>
          <div className="bg-blue-50 p-3 rounded border border-blue-200 text-left text-sm text-blue-800 mt-4">
            <p className="font-semibold mb-1"><i className="fas fa-lightbulb mr-2"></i>Tipps zum Erfolg:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Beobachte genau, was im Video passiert</li>
              <li>Achte auf die verschiedenen Personen und ihre Rollen</li>
              <li>Lies jeden Satz sorgfältig, bevor du die Lücken füllst</li>
              <li>Nutze die Hinweise (Infinitivformen)</li>
              <li>Nimm dir Zeit - Qualität vor Geschwindigkeit</li>
            </ul>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200 text-left text-sm text-green-900 mt-4">
            <p className="font-semibold mb-1"><i className="fas fa-info-circle mr-2"></i>Wichtiger Hinweis zu Akzenten</p>
            <p className="text-xs text-green-800 font-semibold">Falsche oder fehlende Akzente geben keinen Abzug und werden nicht gewertet. Du kannst die Antworten auch ohne Akzente eingeben.</p>
            <p className="text-xs text-green-700 mt-2">Tipp: Falls du Akzente verwenden möchtest - Windows: AltGr + e = é, AltGr + ` dann a = à. Mac: Halte den Buchstaben gedrückt und wähle den Akzent.</p>
          </div>
        </div>

        <div className="aspect-w-16 aspect-h-9 mb-8 bg-black rounded-lg overflow-hidden shadow-lg" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <video
            src="/assets/2026-01-14 10-55-38.mp4"
            controls
            preload="metadata"
            className="absolute top-0 left-0 w-full h-full"
            style={{ objectFit: 'contain' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartTest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transform transition hover:scale-105"
          >
            I'm ready! Start the Test <i className="fas fa-play ml-2"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderTesting = () => {
    if (!exercise) return null;

    return (
      <div className="max-w-4xl mx-auto mt-8 mb-20 p-8 bg-paper shadow-2xl rounded-sm border border-gray-300 min-h-[600px]">
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200">
           <div>
              <h2 className="text-2xl font-serif font-bold text-ink">{exercise.title}</h2>
              <p className="text-sm text-gray-500 italic">
                Topic: {exercise.topic} | Level: {exercise.difficulty}
                {exercise.gradeLevel && ` | ${exercise.gradeLevel}`}
                {exercise.totalPoints && ` | ${exercise.totalPoints} Punkte`}
              </p>
           </div>
           <Timer
             isActive={state === AppState.TESTING}
             onTimeUpdate={setTimeElapsed}
             onFocusLost={handleFocusLost}
             totalGaps={exercise.segments?.filter(s => s.type === 'gap').length ||
                        exercise.sections?.reduce((sum, s) => sum + s.segments.filter(seg => seg.type === 'gap').length, 0) || 0}
             maxTimeMinutes={exercise.totalTimeMinutes}
             onTimeExpired={handleTimeExpired}
            startTimestamp={examStartTimestamp ?? undefined}
           />
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {answers.length} / {exercise.segments?.filter(s => s.type === 'gap').length ||
                        exercise.sections?.reduce((sum, s) => sum + s.segments.filter(seg => seg.type === 'gap').length, 0) || 0} gaps filled
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((answers.length) / (exercise.segments?.filter(s => s.type === 'gap').length ||
                        exercise.sections?.reduce((sum, s) => sum + s.segments.filter(seg => seg.type === 'gap').length, 0) || 1)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Render sections if available, otherwise legacy segments */}
        {exercise.sections && exercise.sections.length > 0 ? (
          <div className="space-y-8">
            {exercise.sections.map((section, sectionIdx) => (
              <div key={section.id} className="bg-white p-6 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                    {sectionIdx + 1}
                  </span>
                  {section.title}
                  {section.maxPoints && (
                    <span className="ml-auto text-sm font-normal text-gray-600">
                      ({section.maxPoints} Punkte)
                    </span>
                  )}
                </h3>

                {section.segments && section.segments.length > 0 && (
                  <div className="leading-loose text-lg font-serif text-justify mb-6 test-content">
                    {section.segments.map((segment, idx) => {
                      if (segment.type === 'text') {
                        return <span key={idx}>{segment.content as string}</span>;
                      } else {
                        const gap = segment.content as ClozeGap;
                        const ans = answers.find(a => a.gapId === gap.id)?.value || '';
                        return (
                          <span key={idx} className="inline-block mx-1">
                            <span className="text-sm text-gray-500 block text-center mb-1">({gap.hint})</span>
                            <input
                              type="text"
                              value={ans}
                              onChange={(e) => handleAnswerChange(gap.id, e.target.value)}
                              data-gap-id={gap.id}
                              className="border-b-2 border-gray-800 bg-blue-50/50 px-2 py-1 text-center font-bold w-32 focus:outline-none focus:border-blue-600 focus:bg-blue-100 transition-colors"
                              placeholder="fill..."
                            />
                          </span>
                        );
                      }
                    })}
                  </div>
                )}

                {section.extraQuestion && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                    <h4 className="font-bold text-yellow-900 mb-2">
                      <i className="fas fa-question-circle mr-2"></i>
                      {section.type === 'writing' ? 'Textproduktion' : 'Frage'}
                    </h4>
                    <p className="mb-3 text-gray-700 font-medium">{section.extraQuestion.question}</p>
                    <textarea
                      value={sectionAnswers[section.id] || ''}
                      onChange={(e) => handleSectionAnswerChange(section.id, e.target.value)}
                      data-section-id={section.id}
                      className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      rows={section.type === 'writing' ? 6 : 3}
                      placeholder={section.type === 'writing' ? 'Schreibe deinen Text hier...' : 'Antworte hier...'}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="leading-loose text-lg font-serif text-justify mb-12 test-content">
            {exercise.segments?.map((segment, idx) => {
              if (segment.type === 'text') {
                return <span key={idx}>{segment.content as string}</span>;
              } else {
                const gap = segment.content as ClozeGap;
                const ans = answers.find(a => a.gapId === gap.id)?.value || '';
                return (
                  <span key={idx} className="inline-block mx-1">
                    <span className="text-sm text-gray-500 block text-center mb-1">({gap.hint})</span>
                    <input
                      type="text"
                      value={ans}
                      onChange={(e) => handleAnswerChange(gap.id, e.target.value)}
                      data-gap-id={gap.id}
                      className="border-b-2 border-gray-800 bg-blue-50/50 px-2 py-1 text-center font-bold w-32 focus:outline-none focus:border-blue-600 focus:bg-blue-100 transition-colors"
                      placeholder="fill..."
                    />
                  </span>
                );
              }
            })}
          </div>
        )}

        {/* Extra Question Section */}
        {exercise.extraQuestion && (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
            <h3 className="font-bold text-lg text-blue-900 mb-2"><i className="fas fa-question-circle mr-2"></i>Bonus Question</h3>
            <p className="mb-3 text-gray-700 font-medium">{exercise.extraQuestion.question}</p>
            <textarea
                value={extraAnswer}
                onChange={(e) => setExtraAnswer(e.target.value)}
                data-gap-id={-1}
                className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Answer the question about the video here..."
            />
            </div>
        )}

        <div className="flex justify-end">
           <button
             type="button"
             onClick={handleSubmit}
             className="bg-ink text-white px-8 py-3 rounded hover:bg-gray-800 transition shadow-lg font-sans font-bold uppercase tracking-wider"
           >
             Submit Examination
           </button>
        </div>
      </div>
    );
  };

  const calculateGrade = (percentage: number): string => {
    // Deutsche Notenskala: 1 (sehr gut) bis 6 (ungenügend)
    if (percentage >= 92) return "1 (sehr gut)";
    if (percentage >= 81) return "2 (gut)";
    if (percentage >= 67) return "3 (befriedigend)";
    if (percentage >= 50) return "4 (ausreichend)";
    if (percentage >= 30) return "5 (mangelhaft)";
    return "6 (ungenügend)";
  };

  const renderResults = () => {
     if (!exercise) return null;

     let correct = 0;
     let total = 0;
     let totalPoints = 0;
     let earnedPoints = 0;
     const sectionScores: { sectionId: string; maxPoints: number; earnedPoints: number }[] = [];

     // Calculate scores for sections if available
     if (exercise.sections && exercise.sections.length > 0) {
       exercise.sections.forEach((section) => {
         let sectionCorrect = 0;
         let sectionTotal = 0;

         section.segments.forEach((seg) => {
           if (seg.type === 'gap') {
             sectionTotal++;
             total++;
             const gap = seg.content as ClozeGap;
             const userAns = answers.find(a => a.gapId === gap.id)?.value || "";
             const isCorrect = normalizeText(userAns) === normalizeText(gap.originalWord);
             if (isCorrect) {
               sectionCorrect++;
               correct++;
             }
           }
         });

         // Calculate points for this section (assuming equal distribution)
         const pointsPerGap = section.maxPoints / (sectionTotal || 1);
         const sectionEarned = sectionCorrect * pointsPerGap;

         totalPoints += section.maxPoints;
         earnedPoints += sectionEarned;

         sectionScores.push({
           sectionId: section.id,
           maxPoints: section.maxPoints,
           earnedPoints: Math.round(sectionEarned * 10) / 10
         });
       });
     } else {
       // Legacy: calculate from segments
       exercise.segments?.forEach((seg) => {
         if (seg.type === 'gap') {
           total++;
           const gap = seg.content as ClozeGap;
           const userAns = answers.find(a => a.gapId === gap.id)?.value || "";
           const isCorrect = normalizeText(userAns) === normalizeText(gap.originalWord);
           if (isCorrect) correct++;
         }
       });
       totalPoints = exercise.totalPoints || total;
       earnedPoints = exercise.totalPoints ? (correct / total) * (exercise.totalPoints || total) : correct;
     }

     const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
     const grade = calculateGrade(percentage);

     const results = exercise.segments?.map((seg, idx) => {
         if (seg.type === 'gap') {
             const gap = seg.content as ClozeGap;
             const userAns = answers.find(a => a.gapId === gap.id)?.value || "";
             const isCorrect = normalizeText(userAns) === normalizeText(gap.originalWord);
             return { idx, gap, userAns, isCorrect };
         }
         return null;
     }).filter(Boolean) || [];

     return (
         <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg">
             <div className="text-center mb-10">
                 <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                     <i className="fas fa-graduation-cap text-4xl text-blue-600"></i>
                 </div>
                 <h2 className="text-3xl font-bold text-gray-800">Ergebnisse</h2>
                 <p className="text-gray-500 mt-2">
                   Pardon My French {exercise.gradeLevel ? `• ${exercise.gradeLevel}` : '• Grade 9'}
                   {exercise.curriculum && ` • ${exercise.curriculum}`}
                 </p>

                 {/* Points Display */}
                 {exercise.totalPoints ? (
                   <div className="mt-6">
                     <div className="text-5xl font-bold text-blue-600">
                       {Math.round(earnedPoints * 10) / 10} <span className="text-2xl text-gray-400">/ {totalPoints} Punkte</span>
                     </div>
                     <div className="text-3xl font-bold mt-4 text-gray-700">
                       {Math.round(percentage * 10) / 10}%
                     </div>
                     <div className="text-2xl font-bold mt-2 text-purple-600">
                       Note: {grade}
                     </div>
                   </div>
                 ) : (
                   <div className="text-5xl font-bold mt-6 text-blue-600">
                     {correct} <span className="text-2xl text-gray-400">/ {total}</span>
                   </div>
                 )}

                 <div className="mt-4 text-sm text-gray-600">
                   Bearbeitungszeit: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
                 </div>
                 <div className="mt-2 text-sm text-red-500">
                    Fenster verloren: {focusLostCount} mal
                 </div>
             </div>

             {/* Section Scores */}
             {sectionScores.length > 0 && (
               <div className="bg-gray-50 rounded-lg p-6 mb-8">
                 <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Punkteverteilung nach Aufgabenteilen</h3>
                 <div className="grid gap-4">
                   {exercise.sections?.map((section, idx) => {
                     const score = sectionScores.find(s => s.sectionId === section.id);
                     return (
                       <div key={section.id} className="flex items-center justify-between p-3 rounded border bg-white">
                         <div>
                           <span className="font-bold">{section.title}</span>
                           <span className="text-sm text-gray-500 ml-2">({section.type})</span>
                         </div>
                         <div className="text-right">
                           <span className="font-bold text-blue-600">
                             {score ? Math.round(score.earnedPoints * 10) / 10 : 0} / {section.maxPoints} Punkte
                           </span>
                           {score && (
                             <div className="text-xs text-gray-500">
                               {Math.round((score.earnedPoints / section.maxPoints) * 100)}%
                             </div>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

             {results.length > 0 && (
               <div className="bg-gray-50 rounded-lg p-6 mb-8">
                 <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Grammatik-Korrekturen</h3>
                 <div className="grid gap-4">
                     {results.map((r: any) => (
                         <div key={r.idx} className={`flex items-center justify-between p-3 rounded border ${r.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                             <div className="flex items-center">
                                 <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white border font-bold text-xs mr-4">
                                     {r.gap.id + 1}
                                 </span>
                                 <div>
                                     <div className="text-sm text-gray-500">Hinweis: {r.gap.hint} ({r.gap.tense})</div>
                                     <div className="font-medium">
                                         Deine Antwort: <span className={r.isCorrect ? 'text-green-700' : 'text-red-600 line-through'}>{r.userAns || "(leer)"}</span>
                                     </div>
                                 </div>
                             </div>
                             {!r.isCorrect && (
                                 <div className="text-green-700 font-bold bg-white px-3 py-1 rounded border border-green-200 shadow-sm">
                                     {r.gap.originalWord}
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
               </div>
             )}

             {/* Section Results */}
             {exercise.sections && exercise.sections.length > 0 && (
               <div className="bg-gray-50 rounded-lg p-6 mb-8">
                 <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Detaillierte Ergebnisse nach Aufgabenteilen</h3>
                 {exercise.sections.map((section) => {
                   const sectionResults = section.segments
                     .map((seg, idx) => {
                       if (seg.type === 'gap') {
                         const gap = seg.content as ClozeGap;
                         const userAns = answers.find(a => a.gapId === gap.id)?.value || "";
                         const isCorrect = normalizeText(userAns) === normalizeText(gap.originalWord);
                         return { idx, gap, userAns, isCorrect };
                       }
                       return null;
                     })
                     .filter(Boolean);

                   if (sectionResults.length === 0) return null;

                   return (
                     <div key={section.id} className="mb-6">
                       <h4 className="font-bold text-lg mb-3">{section.title}</h4>
                       <div className="grid gap-3">
                         {sectionResults.map((r: any) => (
                           <div key={r.idx} className={`flex items-center justify-between p-2 rounded border text-sm ${r.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                             <div className="flex items-center">
                               <span className="w-6 h-6 rounded-full flex items-center justify-center bg-white border font-bold text-xs mr-3">
                                 {r.gap.id + 1}
                               </span>
                               <div>
                                 <span className="text-xs text-gray-500">{r.gap.hint}</span>
                                 <div>
                                   <span className={r.isCorrect ? 'text-green-700' : 'text-red-600 line-through'}>
                                     {r.userAns || "(leer)"}
                                   </span>
                                   {!r.isCorrect && (
                                     <span className="ml-2 text-green-700 font-bold">→ {r.gap.originalWord}</span>
                                   )}
                                 </div>
                               </div>
                             </div>
                             {r.isCorrect ? (
                               <i className="fas fa-check-circle text-green-600"></i>
                             ) : (
                               <i className="fas fa-times-circle text-red-600"></i>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}

             {exercise.extraQuestion && (
                <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">Video Comprehension</h3>
                    <div className="mb-4">
                    <p className="text-sm text-blue-800 font-bold mb-1">Question:</p>
                    <p className="text-gray-800">{exercise.extraQuestion.question}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Your Answer</p>
                        <p className="text-gray-800">{extraAnswer || "No answer provided"}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-xs text-green-700 uppercase font-bold mb-1">Model Answer</p>
                        <p className="text-green-900">{exercise.extraQuestion.answer}</p>
                    </div>
                    </div>
                </div>
             )}

             <div className="flex justify-center">
                 <button
                    onClick={downloadPDF}
                    className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition shadow-lg font-bold"
                 >
                     <i className="fas fa-file-pdf"></i>
                     <span>Download PDF Report</span>
                 </button>
             </div>
         </div>
     )
  };

  return (
    <AntiCheatWrapper isActive={state === AppState.TESTING} onIncident={handleSecurityIncident}>
      <KeystrokeLogger
        isActive={state === AppState.TESTING}
        onLogUpdate={handleKeystrokeUpdate}
      />
      <div className="min-h-screen pb-20">
        <header className="bg-ink text-white py-4 shadow-md">
           <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                 <i className="fas fa-university text-2xl text-blue-300"></i>
                 <span className="font-serif text-xl tracking-wide">Pardon My French</span>
              </div>
              <div className="text-sm text-gray-400">
                Secure Exam
              </div>
           </div>
        </header>

        {state === AppState.SETUP && !isExamCompleted && (
          <ExerciseGenerator onSelectExam={handleSelectExam} isGenerating={false} />
        )}
        {state === AppState.SETUP && isExamCompleted && (
          <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-xl border-l-4 border-green-600 text-center space-y-4">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Klausur abgeschlossen</h2>
            <p className="text-gray-600">Du hast die Klausur bereits abgegeben. Eine erneute Teilnahme ist nicht möglich.</p>
            <button
              onClick={() => setState(AppState.RESULTS)}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
            >
              Ergebnisse ansehen
            </button>
          </div>
        )}
        {state === AppState.LOADING && <ExerciseGenerator onSelectExam={() => {}} isGenerating={true} />}
        {state === AppState.WATCHING && renderWatching()}
        {state === AppState.TESTING && renderTesting()}
        {state === AppState.RESULTS && renderResults()}
      </div>
    </AntiCheatWrapper>
  );
}