import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary chart components for Line Chart
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      fill: false, // No fill under the line
      borderColor: dataset.borderColor,
      backgroundColor: dataset.backgroundColor,
      pointBackgroundColor: dataset.pointBackgroundColor,
      tension: dataset.tension || 0.4, // Curved line tension
      borderWidth: dataset.borderWidth || 2, // Line thickness
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          boxHeight: 20,
          padding: 10,
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
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
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'User Count',
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
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};







// src/components/Charts.js


// Register necessary chart components for Line Chart
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChartAgent = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.label,
        data: data.values,
        fill: false, // No fill under the line
        borderColor: '#4B9460', // Green line color
        tension: 0.4, // Curved line tension
        backgroundColor: 'rgba(0, 128, 0, 0.2)', // Point background color (green)
        pointBackgroundColor: 'rgba(0, 128, 0, 1)', // Green point color
        borderWidth: 2, // Line thickness
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', 
        labels: {
          boxWidth: 20,
          boxHeight: 20,
          padding: 10,
          color: '#333',
          font: {
            size: 14,
          },
        },
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
          text: 'Dates', 
          font: {
            size: 16,
          },
        },
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
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
    <div style={{ width: '90%', margin: '0 auto', marginTop: '20px' }}> {/* Increased width */}
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};
export {LineChart, LineChartAgent}
export default LineChart;
