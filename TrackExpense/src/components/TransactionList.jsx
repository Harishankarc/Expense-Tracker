import { format } from 'date-fns';
import { supabase } from '../supabaseClient';
import { useEffect,useState } from 'react';
export default function TransactionList({isAdded,setIsAdded}) {
  const [transactionData, setTransactionData] = useState(null);
  const [loading,setLoading] = useState(true);
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
        }else{
          console.log(transactions)
          setTransactionData(transactions)
          setLoading(false)
        }
      }else{
        console.log('no user')
      }
    }
    fetchTransaction()
    setIsAdded(false)
  },[isAdded])

  if(loading){
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
          <p className="text-purple-100 mt-2">Your transaction history</p>
        </div>
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <svg className="w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>  
    )
  }
  if (!transactionData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
          <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
          <p className="text-purple-100 mt-2">Your transaction history</p>
        </div>
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 mb-4">
            <svg className="w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-500">Start by adding your first transaction above.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
        <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
        <p className="text-purple-100 mt-2">Your transaction history</p>
      </div>
      
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {format(transaction.date, 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-medium">
                    <span className={transaction.type === 'income' ? 'text-violet-600' : 'text-pink-600'}>
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${transaction.type === 'income'
                        ? 'bg-violet-100 text-violet-800'
                        : 'bg-pink-100 text-pink-800'
                      }
                    `}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}