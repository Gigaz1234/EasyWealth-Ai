import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SIP' | 'FIRE'>('SIP');

  // SIP State
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [rateOfReturn, setRateOfReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  // FIRE State
  const [annualExpense, setAnnualExpense] = useState(600000);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const sipData = useMemo(() => {
    const data = [];
    let investedAmount = 0;
    let totalValue = 0;
    const monthlyRate = rateOfReturn / 12 / 100;

    for (let year = 1; year <= timePeriod; year++) {
      investedAmount += monthlyInvestment * 12;
      // FV = P * [((1 + i)^n - 1) / i] * (1 + i)
      const n = year * 12;
      totalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
      
      data.push({
        year: `Year ${year}`,
        invested: Math.round(investedAmount),
        value: Math.round(totalValue),
      });
    }
    return data;
  }, [monthlyInvestment, rateOfReturn, timePeriod]);

  const fireNumber = Math.round(annualExpense * (100 / withdrawalRate));

  return (
    <div className="space-y-6 pb-24">
       <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Projections</h2>
        <p className="text-slate-500">Visualize your future wealth</p>
      </header>

      <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('SIP')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'SIP' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          SIP Calculator
        </button>
        <button
          onClick={() => setActiveTab('FIRE')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'FIRE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          FIRE Planner
        </button>
      </div>

      {activeTab === 'SIP' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Monthly Investment (₹)</label>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
                <div className="text-right font-bold text-emerald-600 mt-1">₹{monthlyInvestment.toLocaleString()}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Expected Return (%)</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="0.5"
                  value={rateOfReturn}
                  onChange={(e) => setRateOfReturn(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
                <div className="text-right font-bold text-emerald-600 mt-1">{rateOfReturn}%</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Time Period (Years)</label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                />
                <div className="text-right font-bold text-emerald-600 mt-1">{timePeriod} Years</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between mb-6">
                <div>
                    <p className="text-xs text-slate-500">Invested</p>
                    <p className="font-bold text-slate-700">₹{sipData[sipData.length - 1].invested.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">Estimated Value</p>
                    <p className="font-bold text-emerald-600 text-xl">₹{sipData[sipData.length - 1].value.toLocaleString()}</p>
                </div>
             </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sipData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'FIRE' && (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-lg font-medium opacity-90 mb-1">Your FIRE Number</h3>
              <div className="text-4xl font-bold tracking-tight">₹{fireNumber.toLocaleString()}</div>
              <p className="text-sm mt-4 opacity-80">
                  You need this amount to retire early and withdraw ₹{(annualExpense/12).toLocaleString()}/month indefinitely.
              </p>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Yearly Expenses (₹)</label>
                        <input 
                            type="number" 
                            value={annualExpense} 
                            onChange={(e) => setAnnualExpense(Number(e.target.value))}
                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Withdrawal Rate (%)</label>
                         <input
                            type="range"
                            min="2"
                            max="6"
                            step="0.1"
                            value={withdrawalRate}
                            onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                        />
                        <div className="text-right font-bold text-indigo-600 mt-1">{withdrawalRate}%</div>
                    </div>
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinancialCalculators;