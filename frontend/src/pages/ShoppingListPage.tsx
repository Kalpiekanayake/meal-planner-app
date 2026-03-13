import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Clock, X, Square, CheckSquare } from 'lucide-react';
import { api } from '../api/api';
import { ShoppingItem } from '../api/types';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SectionHeader } from '../components/ui/SectionHeader';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Bakery', 'Drinks', 'Spices', 'Frozen', 'Household', 'Other'];

const ShoppingListPage: React.FC = () => {
  const { shoppingList, refreshData, showToast, requireAuth } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    requireAuth(async () => {
      try {
        await api.createShoppingItem(
          name,
          category,
          quantity || undefined,
          note || undefined
        );
        setName('');
        setCategory('Other');
        setQuantity('');
        setNote('');
        setIsAdding(false);
        showToast('Item added to list', 'success');
        refreshData();
      } catch (err) {
        console.error('Failed to add item:', err);
        showToast('Could not add item', 'error');
      }
    });
  };

  const handleMarkAsBought = async (id: string) => {
    requireAuth(async () => {
      try {
        await api.markShoppingItemAsBought(id);
        refreshData();
      } catch (err) {
        console.error('Failed to update item:', err);
      }
    });
  };

  const handleDeleteItem = async (id: string) => {
    requireAuth(async () => {
      try {
        await api.deleteShoppingItem(id);
        refreshData();
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    });
  };

  const pendingItems = shoppingList.filter(item => item.status === 'pending');
  const boughtItems = shoppingList.filter(item => item.status === 'bought');

  // Group pending items by category
  const groupedItems = CATEGORIES.reduce((acc, cat) => {
    const items = pendingItems.filter(item => item.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Add any categories not in the predefined list
  pendingItems.forEach(item => {
    if (!CATEGORIES.includes(item.category) && item.category) {
      if (!groupedItems[item.category]) groupedItems[item.category] = [];
      groupedItems[item.category].push(item);
    }
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Shopping List</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="primary" icon={<Clock size={14} />}>
              {pendingItems.length} items to buy
            </Badge>
            <Badge variant="neutral" icon={<CheckCircle2 size={14} />}>
              {boughtItems.length} bought
            </Badge>
          </div>
        </div>

        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? 'white' : 'primary'}
          size="lg"
          icon={isAdding ? <X size={20} /> : <Plus size={20} />}
          className="shadow-xl"
        >
          {isAdding ? 'Close' : 'Quick Add'}
        </Button>
      </div>

      {/* Quick Add Bar */}
      {isAdding && (
        <Card className="p-8 border-primary-50 animate-bounce-in" hoverable={false}>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oat Milk"
                required
              />
            </div>
            <div>
              <Input
                label="Category"
                isSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES.map(cat => ({ label: cat, value: cat }))}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full h-[60px]" size="lg">
                Add Item
              </Button>
            </div>
            <div className="md:col-span-2">
              <Input
                label="Quantity (Optional)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 2 cartons"
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Note (Optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any brand preferences?"
              />
            </div>
          </form>
        </Card>
      )}

      {/* Main List */}
      <div className="grid grid-cols-1 gap-10">
        {Object.keys(groupedItems).length === 0 && pendingItems.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-primary-50 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ShoppingBag size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your list is clear</h3>     
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">
              Ready for the next shop? Start adding items above or from your meal plan.
            </p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([cat, items]) => (
            <section key={cat} className="space-y-4">
              <SectionHeader title={cat} badge={items.length} />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card
                    key={item.id} 
                    className="p-5 flex items-center gap-4 group"
                  >
                    <button
                      onClick={() => handleMarkAsBought(item.id)}
                      className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-primary-50 hover:text-primary-500 transition-all shrink-0"
                    >
                      <Square size={20} />
                    </button>

                    <div className="flex-grow min-w-0">
                      <h3 className="font-black text-slate-800 truncate tracking-tight">{item.name}</h3>  
                      {item.quantity && (
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{item.quantity}</p>
                      )}
                      {item.note && (
                        <p className="text-xs text-slate-400 italic mt-1 truncate">{item.note}</p>        
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-200 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}

        {/* Recently Bought */}
        {boughtItems.length > 0 && (
          <section className="mt-8">
            <SectionHeader title="Already in cart" dotColor="bg-slate-300" />

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {boughtItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex items-center gap-3 group opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                >
                  <div className="text-primary-500 shrink-0">
                    <CheckSquare size={20} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm font-bold text-slate-500 line-through decoration-slate-300 truncate">{item.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
