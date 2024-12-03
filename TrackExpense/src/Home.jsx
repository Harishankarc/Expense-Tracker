import { useState,useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetSummary from './components/BudgetSummary';
import { LogOut} from 'lucide-react'
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
export default function Home({user}) {
  const [isAdded,setIsAdded] = useState(false)
  const navigate = useNavigate();     
  const [transactions, setTransactions] = useState([]);
  const handleAddTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }else{
        navigate('/login')
    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center space-x-4">
            <span className="text-gray-600 text-xl">Welcome <span className='font-bold'>{user && user.user_metadata.name}</span></span>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={handleLogout}
            >
            <LogOut size={15}/>
            </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            Budget Analyzer
          </h1>
          <p className="text-gray-600">Track your finances with ease</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="lg:sticky lg:top-8 h-fit">
            <TransactionForm onAddTransaction={handleAddTransaction} user={user} setIsAdded={setIsAdded}/>
          </div>
          <div className="space-y-8">
            <BudgetSummary isAdded={isAdded} setIsAdded={setIsAdded}/>
            <TransactionList isAdded={isAdded} setIsAdded={setIsAdded}/>
          </div>
        </div>
      </div>
    </div>
  );
}