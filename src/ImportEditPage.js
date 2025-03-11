import React, { useContext } from 'react';
import * as XLSX from 'xlsx';
import { ProjectContext } from './ProjectContext';
import { useNavigate } from 'react-router-dom';

const ImportEditPage = () => {
  const { setProjectData } = useContext(ProjectContext);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', dateNF: 'yyyy-mm-dd' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      processExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const processExcelData = (data) => {
    const headers = data[0];
    const rows = data.slice(1).filter(row => row.length > 0);

    // Column indices
    const taskNameIdx = headers.indexOf('Task Name');
    const outlineLevelIdx = headers.indexOf('Outline Level');
    const baselineStartIdx = headers.indexOf('Baseline Start');
    const baselineFinishIdx = headers.indexOf('Baseline Finish');
    const durationIdx = headers.indexOf('Duration');
    const percentCompleteIdx = headers.indexOf('% Complete');
    const startIdx = headers.indexOf('Start');
    const finishIdx = headers.indexOf('Finish');

    if (taskNameIdx === -1 || outlineLevelIdx === -1 || startIdx === -1 || finishIdx === -1) {
      alert('Excel file missing required columns: Task Name, Outline Level, Start, Finish');
      return;
    }

    // Extract phases and milestones
    const phases = [];
    let currentPhase = null;

    rows.forEach(row => {
      const outlineLevel = row[outlineLevelIdx];
      if (outlineLevel === 2) {
        currentPhase = {
          name: row[taskNameIdx],
          status: 'future',
          milestones: []
        };
        phases.push(currentPhase);
      } else if (outlineLevel === 3 && currentPhase) {
        const percentComplete = row[percentCompleteIdx] || 0;
        const status = percentComplete === 100 ? 'completed' :
                       percentComplete > 0 ? 'in-progress' : 'pending';
        currentPhase.milestones.push({
          name: row[taskNameIdx],
          status,
          date: row[baselineFinishIdx],
          startDate: row[startIdx],
          finishDate: row[finishIdx]
        });
      }
    });

    // Determine phase statuses
    phases.forEach(phase => {
      const milestoneStatuses = phase.milestones.map(m => m.status);
      if (milestoneStatuses.every(s => s === 'completed')) {
        phase.status = 'completed';
      } else if (milestoneStatuses.some(s => s === 'in-progress' || s === 'completed')) {
        phase.status = 'active';
      }
    });

    const currentPhaseIdx = phases.findIndex(p => p.status === 'active');
    const currentPhaseName = phases[currentPhaseIdx]?.name || phases[0].name;

    // Calculate monthly progress
    const tasks = rows.filter(row => row[outlineLevelIdx] >= 2);
    let totalDuration = 0;
    tasks.forEach(task => {
      const duration = parseFloat(task[durationIdx]) || 0;
      totalDuration += duration;
    });

    // Use actual Start and Finish dates if available, otherwise fall back to baseline dates
    const getStartDate = (task) => task[startIdx] ? new Date(task[startIdx]) : new Date(task[baselineStartIdx]);
    const getFinishDate = (task) => task[finishIdx] ? new Date(task[finishIdx]) : new Date(task[baselineFinishIdx]);

    const earliestStart = new Date(Math.min(...tasks.map(task => getStartDate(task))));
    const latestFinish = new Date(Math.max(...tasks.map(task => getFinishDate(task))));
    const months = [];
    let currentMonth = new Date(earliestStart.getFullYear(), earliestStart.getMonth(), 1);
    while (currentMonth <= latestFinish) {
      months.push(new Date(currentMonth));
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    const today = new Date();
    const monthlyProgress = months.map(month => {
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      let plannedSum = 0;
      let actualSum = 0;

      tasks.forEach(task => {
        const baselineFinish = new Date(task[baselineFinishIdx]);
        const actualFinish = task[finishIdx] ? new Date(task[finishIdx]) : null;
        const duration = parseFloat(task[durationIdx]) || 0;
        const percentComplete = task[percentCompleteIdx] || 0;

        if (baselineFinish <= monthEnd) {
          plannedSum += duration;
        }
        if ((actualFinish && actualFinish <= monthEnd) || (monthEnd < today && !actualFinish)) {
          actualSum += (duration * percentComplete) / 100;
        }
      });

      return {
        month: month.toLocaleString('default', { month: 'short' }),
        planned: Math.round((plannedSum / totalDuration) * 100) || 0,
        actual: Math.round((actualSum / totalDuration) * 100) || 0
      };
    });

    // Update project data
    const newProjectData = {
      name: "PCIe Gen6 SerDes IP Development",
      currentPhase: currentPhaseName,
      startDate: earliestStart.toISOString().split('T')[0],
      targetCompletionDate: latestFinish.toISOString().split('T')[0],
      actualProgress: monthlyProgress[monthlyProgress.findIndex(m => new Date(`${m.month} 1, ${today.getFullYear()}`) >= today) - 1]?.actual || 0,
      plannedProgress: monthlyProgress[monthlyProgress.findIndex(m => new Date(`${m.month} 1, ${today.getFullYear()}`) >= today) - 1]?.planned || 0,
      phases,
      monthlyProgess: monthlyProgress,
      // Preserve other fields with defaults
      budget: { planned: 1200000, actual: 1150000 },
      resources: { allocated: 24, utilized: 22 },
      qualityMetrics: { verificationCoverage: 78, bugDensity: 0.45, berPerformance: "10^-12 @ 32GT/s" },
      technicalPerformance: {
        power: { target: "250mW", actual: "275mW", status: "warning" },
        performance: { target: "32GT/s", actual: "32GT/s", status: "success" },
        area: { target: "0.8mm²", actual: "0.82mm²", status: "warning" }
      },
      standardsCompliance: [
        { name: "PCIe 6.0", status: "In Progress", percent: 75 },
        { name: "IEEE 802.3", status: "Planned", percent: 10 }
      ],
      risks: [
        { id: 1, name: "Signal Integrity at 32GT/s", severity: "high", status: "open", mitigation: "Implementing advanced equalization" },
        { id: 2, name: "Power target overrun", severity: "medium", status: "mitigating", mitigation: "Power gating optimization" },
        { id: 3, name: "Compliance test delays", severity: "medium", status: "open", mitigation: "Early engagement with lab" }
      ],
      eyeDiagramData: {
        status: "Marginal",
        eyeHeight: "220mV",
        eyeWidth: "0.45UI",
        jitter: "4.2ps",
        targetValues: { eyeHeight: "250mV", eyeWidth: "0.5UI", jitter: "3.5ps" }
      }
    };

    setProjectData(newProjectData);
    alert('Data imported successfully!');
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f7fa' }}>
      <h2>Import Project Schedule</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={{ margin: '16px 0' }}
      />
      <p>Upload an Excel file exported from MS Project to populate the dashboard.</p>
    </div>
  );
};

export default ImportEditPage;