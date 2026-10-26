import React, { useState } from 'react';
import { 
  ClipboardList, 
  Send, 
  FileJson, 
  Database,
  ShieldCheck,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [showJsonStream, setShowJsonStream] = useState(true);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  const [patient] = useState({
    id: "PT-88301",
    name: "Eleanor Vance",
    age: 62,
    gender: "Female",
    height: "162",
    weight: "84.5",
    encounter: "ENC-2026-9940"
  });

  const [assessment] = useState({
    anthropometrics: [
      { code: "AD-1.1.1", term: "Height", value: "162", unit: "cm" },
      { code: "AD-1.1.2", term: "Weight", value: "84.5", unit: "kg" }
    ],
    biochemical: [
      { code: "BD-1.5.1", term: "Fasting Blood Glucose", value: "158", unit: "mg/dL" },
      { code: "BD-1.5.2", term: "HbA1c", value: "8.6", unit: "%" }
    ]
  });

  const [pes, setPes] = useState({
    code: "NI-5.4",
    problem: "Inappropriate Intake of Types of Carbohydrates",
    etiology: "insufficient previous diabetes self-management education regarding glycemic control",
    signs: "HbA1c of 8.6% and average daily intake exceeding carbohydrate targets by 40%"
  });

  const [intervention] = useState({
    code: "E-1.1",
    term: "Initial/Brief Nutrition Education",
    details: "Provide instruction on carbohydrate counting, label reading, and consistent meal timing."
  });

  const [monitoring] = useState({
    code: "BD-1.5.2",
    indicator: "Glycated Hemoglobin (HbA1c)",
    target: "Reduce HbA1c to < 7.5%",
    timeframe: "90 days"
  });

  const heightM = (parseFloat(patient.height) || 0) / 100;
  const weightKg = parseFloat(patient.weight) || 0;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : "0.0";

  const generatedPesStatement = `${pes.problem} (${pes.code}) related to ${pes.etiology} as evidenced by ${pes.signs}.`;

  const encptPayload = {
    encounter_id: patient.encounter,
    patient_id: patient.id,
    timestamp: new Date().toISOString(),
    nutrition_assessment: assessment,
    nutrition_diagnosis: [
      {
        problem_code: pes.code,
        problem_term: pes.problem,
        etiology: pes.etiology,
        signs_symptoms: [pes.signs],
        pes_statement: generatedPesStatement
      }
    ],
    nutrition_intervention: [intervention],
    monitoring_evaluation: [monitoring]
  };

  const handleApiTransmit = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setResponseStatus({
        code: 201,
        message: "eNCPT Record successfully validated against schema & persisted in EHR database.",
        tx_id: "TXN-" + Math.floor(100000 + Math.random() * 900000)
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 tracking-wide uppercase">Standardized Clinical Charting Workspace</h1>
            <p className="text-[11px] text-slate-400">eNCPT Interoperability & REST API Payload Generator</p>
          </div>
        </div>

        <button 
          onClick={() => setShowJsonStream(!showJsonStream)}
          className="flex items-center space-x-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <FileJson className="h-4 w-4 text-emerald-400" />
          <span>{showJsonStream ? "Hide JSON Stream" : "Inspect JSON Stream"}</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">eNCPT Workflow Steps</p>
            <nav className="space-y-1">
              {[
                { id: 1, label: "1. Assessment", domain: "AD & BD Domains" },
                { id: 2, label: "2. Diagnosis", domain: "PES Statement Builder" },
                { id: 3, label: "3. Intervention", domain: "NI Domain Prescriptions" },
                { id: 4, label: "4. Monitoring", domain: "ME Evaluation Criteria" }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition text-xs flex flex-col ${
                    activeStep === step.id 
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold" 
                      : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>{step.label}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{step.domain}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="h-4 w-4" />
              <span>Schema Validated</span>
            </div>
            <p className="text-[10px] text-slate-400">Compliant with eNCPT terminology standards.</p>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold text-sm border border-slate-700">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">{patient.name}</h2>
                <p className="text-[11px] text-slate-400">MRN: {patient.id} | Sex: {patient.gender} | Age: {patient.age}y</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 border-l border-slate-800 pl-6 text-xs">
              <div>
                <p className="text-slate-500 text-[10px]">Height</p>
                <p className="font-semibold text-slate-200">{patient.height} cm</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Weight</p>
                <p className="font-semibold text-slate-200">{patient.weight} kg</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Calculated BMI</p>
                <p className="font-bold text-emerald-400">{bmi} kg/m²</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-5">
            {activeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Step 1: Nutrition Assessment (AD / BD Domains)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400">Anthropometrics (AD)</span>
                    {assessment.anthropometrics.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                        <span className="font-mono text-emerald-400 text-[10px]">{item.code}</span>
                        <span className="text-slate-300">{item.term}</span>
                        <span className="font-bold text-slate-100">{item.value} {item.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400">Biochemical Data (BD)</span>
                    {assessment.biochemical.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                        <span className="font-mono text-emerald-400 text-[10px]">{item.code}</span>
                        <span className="text-slate-300">{item.term}</span>
                        <span className="font-bold text-slate-100">{item.value} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Step 2: Nutrition Diagnosis (PES Statement Generator)
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Problem (P) Code & Term</label>
                    <input 
                      type="text" 
                      value={pes.problem}
                      onChange={(e) => setPes({...pes, problem: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Etiology (E) - Root Cause</label>
                    <textarea 
                      value={pes.etiology}
                      onChange={(e) => setPes({...pes, etiology: e.target.value})}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Signs & Symptoms (S)</label>
                    <input 
                      type="text" 
                      value={pes.signs}
                      onChange={(e) => setPes({...pes, signs: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Compiled PES Statement</span>
                  <p className="text-xs text-emerald-200 leading-relaxed font-medium">{generatedPesStatement}</p>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 3: Nutrition Intervention (NI Domain)</h3>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold">{intervention.code}</span>
                    <span className="font-bold text-slate-200">{intervention.term}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{intervention.details}</p>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Step 4: Monitoring & Evaluation (ME Domain)</h3>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded font-bold">{monitoring.code}</span>
                    <p className="font-bold text-slate-200 mt-1">{monitoring.indicator}</p>
                    <p className="text-slate-400 text-[11px]">{monitoring.target}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    Timeframe: {monitoring.timeframe}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">Ready to emit REST API payload to EHR endpoint.</div>
            <button
              onClick={handleApiTransmit}
              disabled={isTransmitting}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{isTransmitting ? "Transmitting..." : "Submit eNCPT Payload"}</span>
            </button>
          </div>

          {responseStatus && (
            <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl text-xs space-y-1 font-mono">
              <div className="flex items-center text-emerald-400 font-bold space-x-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>HTTP {responseStatus.code} Created</span>
              </div>
              <p className="text-slate-300 text-[11px]">{responseStatus.message}</p>
              <p className="text-slate-500 text-[10px]">Tx Reference ID: {responseStatus.tx_id}</p>
            </div>
          )}
        </main>

        {showJsonStream && (
          <aside className="w-96 border-l border-slate-800 bg-slate-900/90 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileJson className="h-4 w-4" />
                  Live JSON Stream
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Schema Draft-07
                </span>
              </div>
              <pre className="text-[10px] leading-relaxed font-mono bg-slate-950 p-3.5 rounded-lg overflow-x-auto text-emerald-300 max-h-[600px] border border-slate-800">
                {JSON.stringify(encptPayload, null, 2)}
              </pre>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}