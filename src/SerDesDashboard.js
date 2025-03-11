import React, { useContext, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, DollarSign, FileText, ArrowRight, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { ProjectContext } from './ProjectContext';

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '0',
    padding: '0',
    color: '#333',
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#0c2340',
    color: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: '0',
    fontSize: '1.5rem',
  },
  main: {
    padding: '24px',
  },
  sectionHeader: {
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '8px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '16px',
    marginBottom: '24px',
  },
  flexContainer: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  metricsBox: {
    flex: '1',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  phaseGate: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    position: 'relative',
  },
  phaseBox: {
    padding: '16px',
    borderRadius: '8px',
    flex: '1',
    minWidth: '150px',
    textAlign: 'center',
    position: 'relative',
    zIndex: '1',
    border: '1px solid #ddd',
    margin: '0 4px',
  },
  completedPhase: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  activePhase: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    boxShadow: '0 0 8px rgba(255, 193, 7, 0.5)',
  },
  futurePhase: {
    backgroundColor: '#f8f9fa',
    borderColor: '#ddd',
    color: '#6c757d',
  },
  phaseLine: {
    position: 'absolute',
    height: '2px',
    top: '50%',
    left: '0',
    right: '0',
    backgroundColor: '#ddd',
    zIndex: '0',
  },
  milestoneList: {
    listStyle: 'none',
    padding: '0',
    margin: '16px 0',
  },
  milestone: {
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  completedMilestone: {
    backgroundColor: '#d4edda',
  },
  pendingMilestone: {
    backgroundColor: '#f8f9fa',
  },
  badge: {
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  successBadge: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  warningBadge: {
    backgroundColor: '#ffc107',
    color: '#212529',
  },
  dangerBadge: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  button: {
    backgroundColor: '#0c2340',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginRight: '16px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ddd',
    marginBottom: '16px',
  },
  tab: {
    padding: '12px 24px',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
  },
  activeTab: {
    borderBottom: '3px solid #0c2340',
    fontWeight: 'bold',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
  },
  riskItem: {
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  risksContainer: {
    marginTop: '16px',
  },
  collapsibleSection: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  sectionTitle: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #ddd',
    margin: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  sectionContent: {
    padding: '16px',
  }
};

// Helper component for collapsible sections
const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={styles.collapsibleSection}>
      <div style={styles.sectionTitle} onClick={() => setIsOpen(!isOpen)}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {isOpen && <div style={styles.sectionContent}>{children}</div>}
    </div>
  );
};

// Sample project data
const sampleProjectData = {
  name: "PCIe Gen6 SerDes IP Development",
  currentPhase: "Implementation",
  startDate: "2024-01-15",
  targetCompletionDate: "2025-04-30",
  actualProgress: 47,
  plannedProgress: 52,
  budget: {
    planned: 1200000,
    actual: 1150000,
  },
  resources: {
    allocated: 24,
    utilized: 22,
  },
  qualityMetrics: {
    verificationCoverage: 78,
    bugDensity: 0.45,
    berPerformance: "10^-12 @ 32GT/s",
  },
  technicalPerformance: {
    power: {
      target: "250mW",
      actual: "275mW",
      status: "warning"
    },
    performance: {
      target: "32GT/s",
      actual: "32GT/s",
      status: "success"
    },
    area: {
      target: "0.8mm²",
      actual: "0.82mm²", 
      status: "warning"
    }
  },
  standardsCompliance: [
    { name: "PCIe 6.0", status: "In Progress", percent: 75 },
    { name: "IEEE 802.3", status: "Planned", percent: 10 },
  ],
  risks: [
    { id: 1, name: "Signal Integrity at 32GT/s", severity: "high", status: "open", mitigation: "Implementing advanced equalization techniques" },
    { id: 2, name: "Power target overrun", severity: "medium", status: "mitigating", mitigation: "Power gating optimization in progress" },
    { id: 3, name: "Compliance test delays", severity: "medium", status: "open", mitigation: "Early engagement with compliance lab" },
  ],
  phases: [
    {
      name: "Concept",
      status: "completed",
      milestones: [
        { name: "Requirements document approved", status: "completed", date: "2024-02-10" },
        { name: "High-level architecture sign-off", status: "completed", date: "2024-03-05" },
        { name: "Initial PPA targets established", status: "completed", date: "2024-03-15" },
      ]
    },
    {
      name: "Design",
      status: "completed",
      milestones: [
        { name: "RTL freeze and synthesis-ready code", status: "completed", date: "2024-05-20" },
        { name: "Verification plan finalized", status: "completed", date: "2024-06-05" },
        { name: "Initial synthesis results reviewed", status: "completed", date: "2024-06-18" },
      ]
    },
    {
      name: "Implementation",
      status: "active",
      milestones: [
        { name: "Timing closure achieved", status: "in-progress", date: "2024-09-15" },
        { name: "Physical design (GDSII) complete", status: "pending", date: "2024-10-30" },
        { name: "DRC/LVS clean", status: "pending", date: "2024-11-15" },
      ]
    },
    {
      name: "Verification",
      status: "future",
      milestones: [
        { name: "All test cases passed (pre-silicon)", status: "pending", date: "2024-12-20" },
        { name: "Coverage targets (code, functional) met", status: "pending", date: "2025-01-15" },
        { name: "System-level verification complete", status: "pending", date: "2025-02-01" },
      ]
    },
    {
      name: "Pre-Silicon Validation",
      status: "future",
      milestones: [
        { name: "FPGA/emulation prototyping successful", status: "pending", date: "2025-02-28" },
        { name: "All critical functions validated", status: "pending", date: "2025-03-15" },
      ]
    },
    {
      name: "Tape-Out",
      status: "future",
      milestones: [
        { name: "GDSII delivered to foundry", status: "pending", date: "2025-04-01" },
        { name: "Final design review complete", status: "pending", date: "2025-03-25" },
      ]
    },
    {
      name: "Post-Silicon",
      status: "future",
      milestones: [
        { name: "Silicon bring-up successful", status: "pending", date: "2025-06-15" },
        { name: "Compliance certification (PCIe)", status: "pending", date: "2025-07-30" },
        { name: "Customer samples delivered", status: "pending", date: "2025-08-15" },
      ]
    }
  ],
  monthlyProgess: [
    { month: 'Jan', planned: 5, actual: 5 },
    { month: 'Feb', planned: 12, actual: 11 },
    { month: 'Mar', planned: 20, actual: 19 },
    { month: 'Apr', planned: 28, actual: 25 },
    { month: 'May', planned: 35, actual: 32 },
    { month: 'Jun', planned: 42, actual: 40 },
    { month: 'Jul', planned: 52, actual: 47 },
    { month: 'Aug', planned: 60, actual: 0 },
    { month: 'Sep', planned: 68, actual: 0 },
    { month: 'Oct', planned: 76, actual: 0 },
    { month: 'Nov', planned: 84, actual: 0 },
    { month: 'Dec', planned: 92, actual: 0 },
  ],
  eyeDiagramData: {
    status: "Marginal",
    eyeHeight: "220mV",
    eyeWidth: "0.45UI",
    jitter: "4.2ps",
    targetValues: {
      eyeHeight: "250mV",
      eyeWidth: "0.5UI",
      jitter: "3.5ps",
    }
  }
};

// Colors
const COLORS = {
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  primary: '#0c2340',
  secondary: '#6c757d',
  light: '#f8f9fa',
  muted: '#6c757d',
};

const SerDesDashboard = () => {
  const contextData = useContext(ProjectContext)?.projectData || {};
  const [projectData, setProjectData] = useState(Object.keys(contextData).length > 0 ? contextData : sampleProjectData);
  const [newRisk, setNewRisk] = useState({ id: null, name: '', severity: 'medium', status: 'open', mitigation: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddRiskForm, setShowAddRiskForm] = useState(false);
  
  const getPhaseStyle = (status) => {
    switch(status) {
      case 'completed': return { ...styles.phaseBox, ...styles.completedPhase };
      case 'active': return { ...styles.phaseBox, ...styles.activePhase };
      default: return { ...styles.phaseBox, ...styles.futurePhase };
    }
  };
  
  const getMilestoneStyle = (status) => {
    switch(status) {
      case 'completed': return { ...styles.milestone, ...styles.completedMilestone };
      default: return { ...styles.milestone, ...styles.pendingMilestone };
    }
  };
  
  const getRiskSeverityStyle = (severity) => {
    switch(severity) {
      case 'high': return { backgroundColor: '#ffebee', borderLeft: '4px solid #dc3545' };
      case 'medium': return { backgroundColor: '#fff8e1', borderLeft: '4px solid #ffc107' };
      case 'low': return { backgroundColor: '#e8f5e9', borderLeft: '4px solid #28a745' };
      default: return { backgroundColor: '#f5f5f5', borderLeft: '4px solid #6c757d' };
    }
  };
  
  const handleAddRisk = (e) => {
    e.preventDefault();
    const id = projectData.risks.length > 0 ? Math.max(...projectData.risks.map(r => r.id)) + 1 : 1;
    const updatedRisks = [...projectData.risks, { ...newRisk, id }];
    setProjectData({ ...projectData, risks: updatedRisks });
    setNewRisk({ id: null, name: '', severity: 'medium', status: 'open', mitigation: '' });
    setShowAddRiskForm(false);
  };
  
  const handleComplianceUpdate = (index, field, value) => {
    const updatedCompliance = [...projectData.standardsCompliance];
    updatedCompliance[index][field] = value;
    setProjectData({ ...projectData, standardsCompliance: updatedCompliance });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Silicon Development Dashboard</h1>
        <div>
          <select style={styles.select}>
            <option>PCIe Gen6 SerDes IP</option>
            <option>USB4 SerDes IP</option>
            <option>112G PAM4 SerDes IP</option>
          </select>
          <button style={styles.button}>Generate Report</button>
        </div>
      </header>
      
      <main style={styles.main}>
        {Object.keys(projectData).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No project data available. Please import data from the Import/Edit page.</p>
          </div>
        ) : (
          <>
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2>{projectData.name}</h2>
                <span style={{ ...styles.badge, backgroundColor: COLORS.info, color: 'white' }}>
                  Phase: {projectData.currentPhase}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div><strong>Start Date:</strong> {projectData.startDate}</div>
                <div><strong>Target Completion:</strong> {projectData.targetCompletionDate}</div>
                <div><strong>Progress:</strong> {projectData.actualProgress}% (Plan: {projectData.plannedProgress}%)</div>
              </div>
            </div>
            
            <div style={styles.tabs}>
              <div style={activeTab === 'overview' ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => setActiveTab('overview')}>
                Overview
              </div>
              <div style={activeTab === 'milestones' ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => setActiveTab('milestones')}>
                Milestones & Gates
              </div>
              <div style={activeTab === 'technical' ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => setActiveTab('technical')}>
                Technical Performance
              </div>
              <div style={activeTab === 'risks' ? { ...styles.tab, ...styles.activeTab } : styles.tab} onClick={() => setActiveTab('risks')}>
                Risks & Compliance
              </div>
            </div>
            
            {activeTab === 'overview' && (
              <>
                <CollapsibleSection title="Key Performance Indicators">
                  <div style={styles.gridContainer}>
                    <div style={styles.metricsBox}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={20} />
                        <h3 style={{ margin: 0 }}>Schedule Adherence</h3>
                      </div>
                      <div style={styles.kpiValue}>
                        {projectData.plannedProgress - projectData.actualProgress > 5 ? (
                          <span style={{ color: COLORS.danger }}>-{projectData.plannedProgress - projectData.actualProgress}%</span>
                        ) : (
                          <span style={{ color: COLORS.success }}>On Track</span>
                        )}
                      </div>
                    </div>
                    <div style={styles.metricsBox}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DollarSign size={20} />
                        <h3 style={{ margin: 0 }}>Budget</h3>
                      </div>
                      <div style={styles.kpiValue}>
                        <span style={{ color: COLORS.success }}>
                          {((projectData.budget.actual / projectData.budget.planned) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: COLORS.muted }}>
                        ${projectData.budget.actual.toLocaleString()} / ${projectData.budget.planned.toLocaleString()}
                      </div>
                    </div>
                    <div style={styles.metricsBox}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={20} />
                        <h3 style={{ margin: 0 }}>Verification Coverage</h3>
                      </div>
                      <div style={styles.kpiValue}>
                        <span style={projectData.qualityMetrics.verificationCoverage >= 80 ? { color: COLORS.success } : { color: COLORS.warning }}>
                          {projectData.qualityMetrics.verificationCoverage}%
                        </span>
                      </div>
                    </div>
                    <div style={styles.metricsBox}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={20} />
                        <h3 style={{ margin: 0 }}>Bug Density</h3>
                      </div>
                      <div style={styles.kpiValue}>
                        <span style={projectData.qualityMetrics.bugDensity <= 0.5 ? { color: COLORS.success } : { color: COLORS.danger }}>
                          {projectData.qualityMetrics.bugDensity} / kLoC
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Project Timeline & Progress">
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectData.monthlyProgess}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="planned" stroke="#0c2340" name="Planned Progress" />
                        <Line type="monotone" dataKey="actual" stroke="#dc3545" name="Actual Progress" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Phase Gate Status">
                  <div style={styles.phaseGate}>
                    <div style={styles.phaseLine}></div>
                    {projectData.phases.map((phase, index) => (
                      <div key={index} style={getPhaseStyle(phase.status)}>
                        <h4 style={{ margin: '0 0 8px 0' }}>{phase.name}</h4>
                        {phase.status === 'completed' && <CheckCircle size={24} color={COLORS.success} />}
                        {phase.status === 'active' && <Activity size={24} color={COLORS.warning} />}
                        {phase.status === 'future' && <Clock size={24} color={COLORS.secondary} />}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </>
            )}
            
            {activeTab === 'milestones' && (
              <>
                {projectData.phases.map((phase, phaseIndex) => (
                  <CollapsibleSection key={phaseIndex} title={`${phase.name} Phase`}>
                    <ul style={styles.milestoneList}>
                      {phase.milestones.map((milestone, milestoneIndex) => (
                        <li key={milestoneIndex} style={getMilestoneStyle(milestone.status)}>
                          {milestone.status === 'completed' ? (
                            <CheckCircle size={20} color={COLORS.success} />
                          ) : milestone.status === 'in-progress' ? (
                            <Activity size={20} color={COLORS.warning} />
                          ) : (
                            <Clock size={20} color={COLORS.secondary} />
                          )}
                          <div>
                            <div>{milestone.name}</div>
                            <div style={{ fontSize: '12px', color: COLORS.muted }}>Due: {milestone.date}</div>
                          </div>
                          <div style={{ marginLeft: 'auto' }}>
                            <span style={{
                              ...styles.badge,
                              backgroundColor: milestone.status === 'completed' ? COLORS.success :
                                              milestone.status === 'in-progress' ? COLORS.warning : COLORS.light,
                              color: milestone.status === 'pending' ? COLORS.secondary : 'white'
                            }}>
                              {milestone.status === 'completed' ? 'Completed' :
                               milestone.status === 'in-progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleSection>
                ))}
              </>
            )}
            
            {activeTab === 'technical' && (
              <>
                <CollapsibleSection title="Power, Performance, Area (PPA) Metrics">
                  <div style={styles.gridContainer}>
                    <div style={styles.metricsBox}>
                      <h3 style={{ margin: '0 0 16px 0' }}>Power Consumption</h3>
                      <div style={styles.kpiValue}>
                        <span style={{ color: projectData.technicalPerformance.power.status === 'success' ? COLORS.success : COLORS.warning }}>
                          {projectData.technicalPerformance.power.actual}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: COLORS.muted }}>
                        Target: {projectData.technicalPerformance.power.target}
                      </div>
                    </div>
                    <div style={styles.metricsBox}>
                      <h3 style={{ margin: '0 0 16px 0' }}>Data Rate</h3>
                      <div style={styles.kpiValue}>
                        <span style={{ color: projectData.technicalPerformance.performance.status === 'success' ? COLORS.success : COLORS.warning }}>
                          {projectData.technicalPerformance.performance.actual}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: COLORS.muted }}>
                        Target: {projectData.technicalPerformance.performance.target}
                      </div>
                    </div>
                    <div style={styles.metricsBox}>
                      <h3 style={{ margin: '0 0 16px 0' }}>Silicon Area</h3>
                      <div style={styles.kpiValue}>
                        <span style={{ color: projectData.technicalPerformance.area.status === 'success' ? COLORS.success : COLORS.warning }}>
                          {projectData.technicalPerformance.area.actual}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: COLORS.muted }}>
                        Target: {projectData.technicalPerformance.area.target}
                      </div>
                    </div>
                    <div style={styles.metricsBox}>
                      <h3 style={{ margin: '0 0 16px 0' }}>Bit Error Rate</h3>
                      <div style={styles.kpiValue}>
                        <span style={{ color: COLORS.success }}>{projectData.qualityMetrics.berPerformance}</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Signal Integrity Analysis">
                  <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3>Eye Diagram Analysis Results</h3>
                    <div style={styles.gridContainer}>
                      <div style={styles.metricsBox}>
                        <h4 style={{ margin: '0 0 8px 0' }}>Eye Height</h4>
                        <div style={styles.kpiValue}>
                          <span style={{ color: projectData.eyeDiagramData.eyeHeight < projectData.eyeDiagramData.targetValues.eyeHeight ? COLORS.warning : COLORS.success }}>
                            {projectData.eyeDiagramData.eyeHeight}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', color: COLORS.muted }}>
                          Target: {projectData.eyeDiagramData.targetValues.eyeHeight}
                        </div>
                      </div>
                      <div style={styles.metricsBox}>
                        <h4 style={{ margin: '0 0 8px 0' }}>Eye Width</h4>
                        <div style={styles.kpiValue}>
                          <span style={{ color: projectData.eyeDiagramData.eyeWidth < projectData.eyeDiagramData.targetValues.eyeWidth ? COLORS.warning : COLORS.success }}>
                            {projectData.eyeDiagramData.eyeWidth}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', color: COLORS.muted }}>
                          Target: {projectData.eyeDiagramData.targetValues.eyeWidth}
                        </div>
                      </div>
                      <div style={styles.metricsBox}>
                        <h4 style={{ margin: '0 0 8px 0' }}>Jitter</h4>
                        <div style={styles.kpiValue}>
                          <span style={{ color: projectData.eyeDiagramData.jitter > projectData.eyeDiagramData.targetValues.jitter ? COLORS.warning : COLORS.success }}>
                            {projectData.eyeDiagramData.jitter}
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', color: COLORS.muted }}>
                          Target: {projectData.eyeDiagramData.targetValues.jitter}
                        </div>
                      </div>
                      <div style={styles.metricsBox}>
                        <h4 style={{ margin: '0 0 8px 0' }}>Overall Status</h4>
                        <div style={styles.kpiValue}>
                          <span style={{ 
                            color: projectData.eyeDiagramData.status === 'Good' ? COLORS.success : 
                                  projectData.eyeDiagramData.status === 'Marginal' ? COLORS.warning : COLORS.danger 
                          }}>
                            {projectData.eyeDiagramData.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      height: '200px', 
                      border: '1px dashed #ccc',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: '16px 0',
                      backgroundColor: '#f0f0f0'
                    }}>
                      <p>Eye Diagram Visualization would appear here</p>
                    </div>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Standards Compliance Status">
                  <div style={{ padding: '16px' }}>
                    {projectData.standardsCompliance.map((standard, index) => (
                      <div key={index} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0 }}>{standard.name}</h4>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: standard.status === 'Completed' ? COLORS.success :
                                            standard.status === 'In Progress' ? COLORS.warning : COLORS.light,
                            color: standard.status === 'Planned' ? COLORS.secondary : 'white'
                          }}>
                            {standard.status}
                          </span>
                        </div>
                        <div style={{ height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${standard.percent}%`,
                            backgroundColor: standard.percent >= 75 ? COLORS.success :
                                            standard.percent >= 30 ? COLORS.warning : COLORS.info,
                          }}></div>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '4px' }}>{standard.percent}% complete</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </>
            )}
            
            {activeTab === 'risks' && (
              <>
                <CollapsibleSection title="Risk Management">
                  <div>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>Current Risks</h3>
                      <button style={styles.button} onClick={() => setShowAddRiskForm(true)}>
                        + Add Risk
                      </button>
                    </div>
                    
                    {showAddRiskForm && (
                      <form onSubmit={handleAddRisk} style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <label>Risk Name: <input type="text" value={newRisk.name} onChange={(e) => setNewRisk({ ...newRisk, name: e.target.value })} style={{ padding: '4px' }} required /></label>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label>Severity: 
                            <select value={newRisk.severity} onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })} style={{ padding: '4px' }}>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </label>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label>Status: 
                            <select value={newRisk.status} onChange={(e) => setNewRisk({ ...newRisk, status: e.target.value })} style={{ padding: '4px' }}>
                              <option value="open">Open</option>
                              <option value="mitigating">Mitigating</option>
                              <option value="closed">Closed</option>
                            </select>
                          </label>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label>Mitigation: <input type="text" value={newRisk.mitigation} onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })} style={{ padding: '4px' }} required /></label>
                        </div>
                        <button type="submit" style={styles.button}>Add Risk</button>
                        <button type="button" style={{ ...styles.button, marginLeft: '8px', backgroundColor: '#dc3545' }} onClick={() => setShowAddRiskForm(false)}>Cancel</button>
                      </form>
                    )}
                    
                    <div style={styles.risksContainer}>
                      {projectData.risks.map((risk) => (
                        <div key={risk.id} style={{ ...styles.riskItem, ...getRiskSeverityStyle(risk.severity) }}>
                          <div>
                            <div><strong>{risk.name}</strong></div>
                            <div style={{ fontSize: '14px', marginTop: '4px' }}>Mitigation: {risk.mitigation}</div>
                          </div>
                          <div>
                            <span style={{
                              ...styles.badge,
                              backgroundColor: risk.severity === 'high' ? COLORS.danger :
                                             risk.severity === 'medium' ? COLORS.warning : COLORS.success,
                              color: 'white',
                              marginRight: '8px'
                            }}>
                              {risk.severity.toUpperCase()}
                            </span>
                            <span style={{
                              ...styles.badge,
                              backgroundColor: risk.status === 'open' ? COLORS.secondary :
                                             risk.status === 'mitigating' ? COLORS.info :
                                             risk.status === 'closed' ? COLORS.success : COLORS.light,
                              color: 'white'
                            }}>
                              {risk.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>
                
                <CollapsibleSection title="Compliance Status">
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 16px 0' }}>Standards Compliance</h3>
                    {projectData.standardsCompliance.map((standard, index) => (
                      <div key={index} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0 }}>{standard.name}</h4>
                          <select
                            value={standard.status}
                            onChange={(e) => handleComplianceUpdate(index, 'status', e.target.value)}
                            style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
                          >
                            <option value="Planned">Planned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div style={{ height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${standard.percent}%`,
                            backgroundColor: standard.percent >= 75 ? COLORS.success :
                                          standard.percent >= 30 ? COLORS.warning : COLORS.info,
                          }}></div>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '4px' }}>
                          {standard.percent}% complete
                          <input
                            type="number"
                            value={standard.percent}
                            onChange={(e) => handleComplianceUpdate(index, 'percent', parseInt(e.target.value) || 0)}
                            style={{ width: '60px', marginLeft: '8px', padding: '2px' }}
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SerDesDashboard;