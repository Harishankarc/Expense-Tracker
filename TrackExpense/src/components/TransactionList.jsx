import { format } from 'date-fns';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from "react-icons/ai";
export default function TransactionList({ isAdded, setIsAdded,setIsDeleted }) {
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId,setDeleteId] = useState('');

  async function fetchTransaction() {
    const { data: userData, error } = await supabase.auth.getUser();
    if (userData) {
      let { data: transactions, error } = await supabase
        .from('transaction')
        .select('*')
        .eq('user_email', userData.user.email)
      if (error) {
        console.log(error)
      } else {
        setTransactionData(transactions)
        setLoading(false)
      }
    } else {
      console.log('no user')
    }
  }

  useEffect(() => {
    fetchTransaction()
    setIsAdded(false)
  }, [isAdded])

  function HandleDeleteButtonOnClick(id){
    setIsOpen(true);
    setDeleteId(id);
  }
  async function HandleDelete() {
    const { error,data } = await supabase
      .from('transaction')
      .delete("*")
      .eq('id', deleteId)

    if (error) {
      console.log(error)
    } else {
      console.log('deleted')
      console.log(data)
    }
    fetchTransaction()
    setIsOpen(false)
    setIsDeleted(true)
  }


  if (loading) {
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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
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
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Delete</th>
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
                    <td className="py-3 pl-8 px-4">
                      <span className='cursor-pointer' onClick={() => HandleDeleteButtonOnClick(transaction.id)}><AiOutlineDelete /></span>
                    </td>
                  </tr>

                ))}
              </tbody>

            </table>

          </div>

        </div>
        {isOpen && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div
              className="group select-none w-[250px] flex bg-white flex-col p-4 relative items-center justify-center border border-gray-800 shadow-lg rounded-2xl"
            >
              <div className="">
                <div className="text-center p-3 flex-auto justify-center">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  <h2 className="text-xl font-bold py-4 text-zinc-700">Are you sure?</h2>
                  <p className="font-semibold text-sm text-gray-500 px-2">
                    Do you really want to continue? This process cannot be undone
                  </p>
                </div>
                <div className="p-2 mt-2 text-center space-x-1 md:block">
                  <button
                    className="mb-2 md:mb-0 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-zinc-700 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
                    onClick={() => HandleDelete()}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

    </>
  );
}