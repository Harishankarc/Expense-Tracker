import { format } from 'date-fns';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import { LuFilter } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
export default function TransactionList({ isAdded, setIsAdded, setIsDeleted }) {
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [filter, setFilter] = useState('name');
  const [isFilterOn, setIsFilterOn] = useState(false);
  const [namefilter, setNameFilter] = useState('');
  const [monthfilter, setMonthFilter] = useState('');

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

  function HandleDeleteButtonOnClick(id) {
    setIsOpen(true);
    setDeleteId(id);
  }
  async function HandleDelete() {
    const { error, data } = await supabase
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

  function HandleNameFilterSearch() {
    const filteredData = transactionData.filter((item) =>
      item.description.toLowerCase().includes(namefilter.toLowerCase())
    );
    setTransactionData(filteredData);
  }
  function HandleMonthFilterSearch() {
    const filteredData = transactionData.filter((item) => {
      const month = item.date.slice(5, 7);
      return month === monthfilter && item.description.toLowerCase().includes(namefilter.toLowerCase())
    })
    setTransactionData(filteredData);
  }
  function HandleClearFilter(){
    fetchTransaction(); 
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

  // loading 

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

  //main content

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
            <p className="text-purple-100 mt-2">Your transaction history</p>
          </div>
          <div className='flex justify-end items-center'>
            <LuFilter color='white' size={20} className='cursor-pointer' onClick={() => setIsFilterOn(!isFilterOn)} />
          </div>
        </div>

        {isFilterOn &&
          <div className="max-w-xl w-full md:h-44 h-72 mx-auto bg-white rounded-xl overflow-hidden shadow-lg ">
            <div className='pt-4 pr-4 flex justify-end'>
              <IoMdClose size={20} className='cursor-pointer' onClick={() => setIsFilterOn(!isFilterOn)} />
            </div>
            <div className="flex gap-2 p-2 justify-center">
              <div>
                <input
                  className="peer sr-only"
                  value="name"
                  name="filter"
                  id="name"
                  type="radio"
                  onClick={(e) => {
                    console.log(e.target.value);
                    setFilter(e.target.value)
                  }}
                />
                <div
                  className="flex h-10 w-24 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-purple-400 active:scale-95 peer-checked:border-purple-500 peer-checked:shadow-md peer-checked:shadow-purple-400"
                >
                  <label
                    className="flex cursor-pointer items-center justify-center text-sm text-gray-500 peer-checked:text-purple-500"
                    htmlFor="name"
                  >
                    Name
                  </label>
                </div>
              </div>
              <div>
                <input
                  className="peer sr-only"
                  value="date"
                  name="filter"
                  id="date"
                  type="radio"
                  onClick={(e) => {
                    console.log(e.target.value);
                    setFilter(e.target.value)
                  }}
                />
                <div
                  className="flex h-10 w-24 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-gray-300 bg-gray-50 p-1 transition-transform duration-150 hover:border-indigo-400 active:scale-95 peer-checked:border-indigo-500 peer-checked:shadow-md peer-checked:shadow-indigo-400"
                >
                  <label
                    className="flex cursor-pointer items-center justify-center text-sm text-gray-500 peer-checked:text-indigo-500"
                    htmlFor="date"
                  >
                    Month
                  </label>
                </div>
              </div>
              <div>
                <button className="bg-purple-700 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => HandleClearFilter()}>Clear Filter</button>
              </div>
            </div>
            {
              filter === 'name' ? (
                <div className='flex justify-center items-center mt-5 '>
                  <input type="text" placeholder="Search by name" className="w-1/2 px-4 py-2 ml-5 mr-5 border rounded-sm focus:outline-none shadow-lg bg-gray-50" onChange={(e) => setNameFilter(e.target.value)} />
                  <div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => HandleNameFilterSearch()}>Search</button>
                  </div>
                </div>
              ) : (
                <div className='flex justify-center items-center mt-5 '>
                  <div className='flex gap-2 md:flex-row flex-col'>
                  <input type="text" placeholder="Search by name" className="md:w-1/2 w-full px-4 py-2  border rounded-sm focus:outline-none shadow-lg bg-gray-50 text-gray-500" onChange={(e) => setNameFilter(e.target.value)} />
                    <select className="w-full bg-gray-50 rounded-sm border px-2 py-2 focus:outline-none shadow-lg text-gray-500" id="country" onChange={(e) => setMonthFilter(e.target.value)}>
                      <option value="">Select a month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={() => HandleMonthFilterSearch()}>Search</button>
                  </div>
                </div>
              )

            }

          </div>

        }

        <div className="px-8 py-4">
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
                        ₹{transaction.amount.toFixed(2)}
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