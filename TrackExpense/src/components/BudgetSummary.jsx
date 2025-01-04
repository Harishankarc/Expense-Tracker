import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useState,useEffect } from 'react';
import { supabase } from '../supabaseClient';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetSummary({isAdded,setIsAdded,isDeleted}) {
  const [transactionData, setTransactionData] = useState(null);
  useEffect(()=>{
    async function fetchTransaction(){
      const { data:userData, error } = await supabase.auth.getUser();
      console.log(userData)
      if(userData){
        let { data: transactions, error } = await supabase
        .from('transaction')
        .select('*')
        .eq('user_email',userData.user.email)
        if(error){
          console.log(error)
        }else{setIsAdded
          console.log(transactions)
          setTransactionData(transactions)
        }
      }else{
        console.log('no user')
      }
    }
    fetchTransaction()
    setIsAdded(false)
  },[isAdded,isDeleted])
  let income,expenses,balance = 0;
  if(transactionData){
    income = transactionData
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
    expenses = transactionData
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

    balance = income - expenses;
  }
  

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [income, expenses],
        backgroundColor: ['#8B5CF6', '#EC4899'],
        borderColor: ['#6D28D9', '#DB2777'],
        borderWidth: 1,
      },
    ],
  };

  const StatCard = ({ title, amount = 0, type }) => {
    const getColor = () => {
      switch (type) {
        case 'income': return 'from-violet-500 to-violet-600';
        case 'expense': return 'from-pink-500 to-pink-600';
        default: return 'from-indigo-500 to-indigo-600';
      }
    };

    return (
      <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg">
        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${getColor()}`} />
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold ${
            type === 'income' ? 'text-violet-600' : 
            type === 'expense' ? 'text-pink-600' : 'text-indigo-600'
          }`}>
            ₹{amount.toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
        <h2 className="text-2xl font-bold text-white">Budget Summary</h2>
        <p className="text-purple-100 mt-2">Your financial overview</p>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Income" amount={income} type="income" />
          <StatCard title="Total Expenses" amount={expenses} type="expense" />
          <StatCard title="Current Balance" amount={balance} type="balance" />
        </div>
        
        <div className="w-full max-w-xs mx-auto">
          <Doughnut 
            data={chartData}
            options={{
              cutout: '70%',
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}