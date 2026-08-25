import React, { useState } from 'react';
import { Settings, Save, RotateCw, CheckCircle, BellRing, Monitor, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

export default function SettingsPage() {
  const [targetSla, setTargetSla] = useState('95');
  const [defaultRange, setDefaultRange] = useState('Last 30 Days');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [theme, setTheme] = useState('Deep Navy (Default)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(false);

    // Save delay
    setTimeout(() => {
      setSaveSuccess(true);
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 600);
  };

  const handleReset = () => {
    setTargetSla('95');
    setDefaultRange('Last 30 Days');
    setEmailAlerts(true);
    setSystemAlerts(true);
    setTheme('Deep Navy (Default)');
    setSaveSuccess(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-brand-navy-800 pb-5 select-none">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Platform Settings</span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1 font-heading">System Preferences</h1>
        <p className="text-xs text-gray-400 mt-1">Configure workspace parameters, target thresholds, notifications, and custom themes.</p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {saveSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-sm select-none animate-fade-in">
            <CheckCircle size={16} />
            <span>Settings saved successfully! System defaults updated.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
          
          {/* Card 1: Dashboard Preferences */}
          <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-brand-navy-850 pb-2.5">
              <ShieldCheck size={16} className="text-blue-500" />
              <span>Target & Scoping Constants</span>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Global SLA Compliance Target (%)"
                id="setting-sla"
                type="number"
                min="50"
                max="100"
                value={targetSla}
                onChange={(e) => setTargetSla(e.target.value)}
              />
              
              <Select
                label="Default Scoping Range"
                id="setting-range"
                value={defaultRange}
                onChange={(e) => setDefaultRange(e.target.value)}
                options={['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Full Historical (YTD)']}
              />
            </div>
          </div>

          {/* Card 2: Notifications Preferences */}
          <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-brand-navy-850 pb-2.5">
              <BellRing size={16} className="text-blue-500" />
              <span>Incident Alerts Control</span>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-brand-navy-950/40 border border-brand-navy-850 rounded-lg cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-gray-200">Email Exceptions Report</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Send daily operational missed SLA lists to team managers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded bg-brand-navy-950 border-brand-navy-800 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-brand-navy-950/40 border border-brand-navy-850 rounded-lg cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-gray-200">Real-Time Ingestion Failures</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Trigger instant push warnings for pipeline blockages.</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemAlerts}
                  onChange={(e) => setSystemAlerts(e.target.checked)}
                  className="rounded bg-brand-navy-950 border-brand-navy-800 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Card 3: Interface Theme */}
          <div className="bg-brand-navy-950/30 border border-brand-navy-850 p-6 rounded-xl space-y-4 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-brand-navy-850 pb-2.5">
              <Monitor size={16} className="text-blue-500" />
              <span>Interface Appearance</span>
            </div>
            
            <Select
              label="Selected Theme Palette"
              id="setting-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              options={['Deep Navy (Default)', 'Steel Gray Minimalist', 'High Contrast Ingestion Theme']}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 select-none">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset Defaults
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            icon={<Save size={16} />}
          >
            Save Workspace Settings
          </Button>
        </div>

      </form>

    </div>
  );
}
