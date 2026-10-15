
import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        {Icon && <Icon size={20} />}
      </div>
      <h2>{value}</h2>
      <p><TrendingUp size={14} /> {change}</p>
    </div>
  );
}
