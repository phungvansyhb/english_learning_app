'use client';
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
const data = {
	labels: ['Vocabulary', 'Reading', 'Listening', 'Writing', 'Speaking'],
	datasets: [
		{
			label: 'Current Accuracy',
			data: [69, 80, 50, 75, 90], // Values matching the labels order
			backgroundColor: 'oklch(77.926% 0.10977 300.171 / 0.35)', // Light Tailwind blue fill
			borderColor: 'oklch(0.78 0.11 300)', // Tailwind blue border
			borderWidth: 3,
			lineTension: 0.2,
			pointBackgroundColor: 'oklch(0.78 0.11 300)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'oklch(0.78 0.11 300)',
		},
		{
			label: 'Target Goal',
			data: [95, 85, 85, 85, 85], // Second dataset for comparison
			backgroundColor: 'oklch(85.925% 0.10044 164.716 / 0.247)', // Light Tailwind yellow fill
			borderColor: 'oklch(0.86 0.1 165)', // Tailwind yellow border
			borderWidth: 3,
			lineTension: 0.2,
			pointBackgroundColor: 'oklch(0.86 0.1 165)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'oklch(0.86 0.1 165)',
		},
	],
};
const options = {
	responsive: true,
	borderJoinStyle: 'round',
	scales: {
		r: {
			grid: {
				circular: true, // Chuyển từ hình đa giác góc nhọn sang các đường tròn đồng tâm mượt mà
				color: '#9ca3af2b', // Màu sắc của đường lưới (Gray-400)
				lineWidth: 1, // Độ dày đường lưới
				borderDash: [5, 5],
			},
			angleLines: {
				display: true,
				color: '#cbd5e1', // Màu đường trục thẳng (Gray-300)
				lineWidth: 1,
				borderDash: [5, 5],
			},
			ticks: {
				display: false, // Ẩn số thang đo để nhìn lưới rõ hơn
			},
			suggestedMin: 10,
			suggestedMax: 100,
		},
	},
	pointLabels: {
		font: {
			size: 14, // Kích thước chữ của 'Reading', 'Listening',...
			weight: 'bold' as const, // Độ đậm chữ
		},
		color: 'oklch(0.708 0 0)',
		centerPointLabel: true,
	},
	plugins: {
		legend: {
			position: 'top' as const,
			labels: {
				font: {
					size: 11, // Kích thước chữ của 'Reading', 'Listening',...
					weight: 'bold' as const, // Độ đậm chữ
				},
				color: '#1f2937d5', // Màu chữ (Gray-800)
			},
		},
	},
};
export function PerformanceAnalysis() {
	return (
		<section>
			<h2 className='font-bold text-foreground text-lg'>Performance analysis</h2>
			<div className='mt-4'>
				<Radar
					data={data}
					options={options}
				/>
			</div>
		</section>
	);
}
