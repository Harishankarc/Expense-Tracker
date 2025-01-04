import { useState } from 'react';
import FormInput from './form/FormInput';
import RadioGroup from './form/RadioGroup';
import SubmitButton from './form/SubmitButton';
import { supabase } from '../supabaseClient';
export default function TransactionForm({ user,setIsAdded }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target?.value ?? e;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    handleExpenseSubmit();

    setFormData({
      description: '',
      amount: '',
      type: 'expense'
    });
    setErrors({});
  };

  const typeOptions = [
    { value: 'expense', label: 'Expense', name: 'type' },
    { value: 'income', label: 'Income', name: 'type' }
  ];

  const isFormValid = formData.description && formData.amount && parseFloat(formData.amount) > 0;

  async function handleExpenseSubmit(){
    const { data, error } = await supabase
    .from('transaction')
    .insert({
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      user_email: user.email,
      user_id: user.id,
      date: new Date()
    });
    if (error) {
      console.log(error);
    }else{
      console.log(data);
      console.log("Added!!")
      setIsAdded(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
        <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
        <p className="text-purple-100 mt-2">Enter your income or expenses</p>
      </div>
      
      <div className="p-8 space-y-6">
        <FormInput
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleChange('description')}
          placeholder="Enter transaction description"
          error={errors.description}
          icon="description"
        />

        <FormInput
          id="amount"
          label="Amount (₹)"
          type="number"
          value={formData.amount}
          onChange={handleChange('amount')}
          placeholder="0.00"
          step="0.01"
          min="0"
          error={errors.amount}
          icon="dollar"
        />

        <RadioGroup
          options={typeOptions}
          value={formData.type}
          onChange={handleChange('type')}
          label="Transaction Type"
        />

        <SubmitButton 
          type={formData.type}
          disabled={!isFormValid}
          onclick={handleSubmit}
        />
      </div>
    </form>
  );
}