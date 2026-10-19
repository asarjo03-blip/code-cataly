import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './PriceChart.css';

export default function PriceChart({ data = [], unit = 'D/kg' }) {
  if (!data.length) {
    return <p className="price-chart__empty">No price history yet.</p>;
  }

  return (
    <div className="price-chart">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8de" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b756e' }} />
          <YAxis tick={{ fontSize: 11, fill: '#6b756e' }} unit="" width={40} />
          <Tooltip
            formatter={(value) => [`D${value}/${unit.replace('D/', '')}`, 'Price']}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #dde3d8',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1f9a52"
            strokeWidth={3}
            dot={{ r: 3, fill: '#1f9a52' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
