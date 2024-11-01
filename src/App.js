import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './App.css';

// chart.js components
Chart.register(...registerables);

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [itemImportance, setItemImportance] = useState('Low');

  const totalExpenses = items.reduce((total, item) => total + item.cost, 0);
  const totalSavings = monthlyIncome - totalExpenses;

  const addItem = () => {
    if (itemName && itemCost) {
      setItems([
        ...items,
        { name: itemName, cost: parseFloat(itemCost), importance: itemImportance }
      ]);
      setItemName('');
      setItemCost('');
      setItemImportance('Low');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const sortedItems = items.sort((a, b) => {
    const importanceOrder = { High: 1, Medium: 2, Low: 3 };
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });

  const saveAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Budget Tracker', 20, 20);
    doc.setFontSize(12);
    doc.text(`Monthly Income: $${monthlyIncome.toFixed(2)}`, 20, 30);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 40);
    doc.text(`Total Savings: $${totalSavings.toFixed(2)}`, 20, 50);
    doc.text('Expenses:', 20, 60);
    
    sortedItems.forEach((item, index) => {
      doc.text(`${item.name} (${item.importance}): $${item.cost.toFixed(2)}`, 20, 70 + index * 10);
    });

    doc.save('budget_tracker.pdf');
  };

  // coloe palette expenses
  const colorPalette = [
    '#ff3300', 
    '#ff8566', 
    '#801a00', 
    '#8B6F47',
    '#9966FF', 
    '#FF9F40',
    '#000099',
    '#99004d',
    '#ffff00', 
  ];

  // pie chart data
  const pieData = {
    labels: [...sortedItems.map(item => item.name), 'Total Savings'],
    datasets: [
      {
        data: [...sortedItems.map(item => item.cost), totalSavings],
        backgroundColor: [...sortedItems.map((_, index) => colorPalette[index % colorPalette.length]), '#36A2EB'], // Cycle through colors for expenses, blue for savings
        hoverBackgroundColor: [...sortedItems.map((_, index) => colorPalette[index % colorPalette.length]), '#36A2EB'],
      },
    ],
  };

  return (
    <div className="App">
      <h1>Budget Tracker</h1>

      <div className="income-input">
        <label>Monthly Income: </label>
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Expense Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cost"
          value={itemCost}
          onChange={(e) => setItemCost(e.target.value)}
        />
        <select
          value={itemImportance}
          onChange={(e) => setItemImportance(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addItem}>Add Item</button>
      </div>

      <h2>Expenses</h2>
      <ul>
        {sortedItems.map((item, index) => (
          <li key={index} className="expense-item">
            <div className="expense-details">
              <span>{item.name}</span>
              <span>${item.cost.toFixed(2)}</span>
              <span className="importance">{item.importance}</span>
            </div>
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>Total Expenses: ${totalExpenses.toFixed(2)}</h2>
      <h2>Total Savings: ${totalSavings.toFixed(2)}</h2>

      {/* pie chart component */}
      <div style={{ width: '100%', maxWidth: '490px', margin: '20px auto' }}>
        <h2>Expenses vs Savings</h2>
        <Pie data={pieData} />
      </div>
      <button onClick={saveAsPDF}>Save as PDF</button>
    </div>
  );
}

export default App;
