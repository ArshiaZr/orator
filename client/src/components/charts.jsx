"use client"

import React from 'react';
import {
  LineChart, CartesianGrid, Tooltip, XAxis, YAxis, Line, ResponsiveContainer, Legend, Label
} from 'recharts';

const Charts = () => {
  const data = [
    {
        speech: 1,
        Percentage: 64.67
    },
    {
        speech: 2,
        Percentage: 69.50
    },
    {
        speech: 3,
        Percentage: 76.00
    },
    {
        speech: 4,
        Percentage: 83.50
    },
    {
        speech: 5,
        Percentage: 85.67
    }
  ];

  return (
    <div style={{ width: '30%', height: 450, marginLeft: "5vw" }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="speech" height={60}>
            <Label value="Number of Speeches" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}>
          </YAxis>
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Legend verticalAlign="top" height={36}/>
          <Line
            type="monotone"
            dataKey="Percentage"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;
