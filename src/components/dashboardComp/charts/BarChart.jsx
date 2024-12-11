// src/components/Charts.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const BarChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.label,
        data: data.values,
        backgroundColor: (context) => {
          const value = context.raw; // Bar value
          const maxValue = Math.max(...data.values); // Max value to determine the bar height
          const percentage = value / maxValue; // Calculate percentage height
          return `linear-gradient(to top, rgba(0, 128, 0, 1) ${percentage * 100}%, rgba(169, 169, 169, 0.4) ${percentage * 100}%)`; 
          // Green up to the bar's value, grey for the rest of the bar
        },
        borderColor: '#4B9460', // Border color for bars
        borderWidth: 1, // Border thickness
        barThickness: 20, // Thickness of bars
        borderRadius: 10, // Round the top and bottom of the bars
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable legends
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          font: {
            size: 16,
          },
        },
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: 'Applications',
          font: {
            size: 16,
          },
        },
        grid: {
          display: false,
        },
        beginAtZero: true, 
      },
    },
  };

  return (
    <div style={{ width: '90%', margin: '0 auto', marginTop: '20px' }}>
      <Bar data={chartData} options={chartOptions} height={80} />
    </div>
  );
};

export default BarChart;
