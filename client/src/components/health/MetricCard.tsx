import React from "react";

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: string;
  color: string;
}

interface MetricCardProps {
  metric: Metric;
  onRemove: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, onRemove }) => {
  return (
    <div className={`bg-gradient-to-r ${metric.color} text-white p-6 rounded-2xl shadow-lg relative min-h-[140px] group hover:scale-105 transform transition-all`}>
      <button 
        onClick={onRemove}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 w-6 h-6 rounded-full flex items-center justify-center text-xs"
      >
        ×
      </button>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
          <p className="text-2xl font-bold">{metric.value}</p>
          <p className={`text-sm mt-2 ${
            metric.trend === 'up' ? 'text-green-200' : 
            metric.trend === 'down' ? 'text-red-200' : 'text-yellow-200'
          }`}>
            {metric.change}
          </p>
        </div>
        <span className="text-2xl p-2 bg-white/20 rounded-full">{metric.icon}</span>
      </div>
    </div>
  );
};

export default MetricCard;
