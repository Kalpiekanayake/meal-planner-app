import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Plus, Trash2, CheckCircle2, Clock, X, 
  Square, CheckSquare, Search, Trash, CheckCircle
} from 'lucide-react';
import { api } from '../api/api';
import { ShoppingItem } from '../api/types';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Bakery', 'Drinks', 'Spices', 'Frozen', 'Household', 'Other'];

const ShoppingListPage: React.FC = () => {
  const { shoppingList, refreshData, showToast, requireAuth } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
        showToast(`"${name}" added`, 'success');
        refreshData();
      } catch (err) {
        showToast('Could not add item', 'error');
      }
    });
  };

  const toggleItemStatus = async (item: ShoppingItem) => {
    requireAuth(async () => {
      try {
        if (item.status === 'pending') {
          await api.markShoppingItemAsBought(item.id);
          showToast(`"${item.name}" in cart`, 'success');
        } else {
          await api.markShoppingItemAsPending(item.id);
          showToast(`"${item.name}" to buy`, 'info');
        }
        refreshData();
      } catch (err) {
        showToast('Failed to update item', 'error');
      }
    });
  };

  const handleDeleteItem = async (id: string, name: string) => {
    requireAuth(async () => {
      try {
        await api.deleteShoppingItem(id);
        showToast(`Removed "${name}"`, 'info');
        refreshData();
      } catch (err) {
        showToast('Failed to delete item', 'error');
      }
    });
  };

  const clearBoughtItems = async () => {
    const boughtItems = shoppingList.filter(i => i.status === 'bought');
    if (boughtItems.length === 0) return;
    
    if (!confirm(`Clear all ${boughtItems.length} items in cart?`)) return;

    requireAuth(async () => {
      try {
        await Promise.all(boughtItems.map(item => api.deleteShoppingItem(item.id)));
        showToast('Cart cleared', 'success');
        refreshData();
      } catch (err) {
        showToast('Failed to clear items', 'error');
      }
    });
  };

  // Process list: Merge duplicates and filter
  const processedList = useMemo(() => {
    const merged: Record<string, ShoppingItem> = {};
    
    shoppingList.forEach(item => {
      const key = `${item.name.toLowerCase()}-${item.status}`;
      
      if (!merged[key]) {
        merged[key] = { ...item };
      }
    });
    
    return Object.values(merged);
  }, [shoppingList]);

  const filteredList = useMemo(() => {
    return processedList
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        // Pending first
        if (a.status === 'pending' && b.status === 'bought') return -1;
        if (a.status === 'bought' && b.status === 'pending') return 1;
        // Then by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [processedList, searchQuery]);

  const pendingCount = shoppingList.filter(i => i.status === 'pending').length;
  const boughtCount = shoppingList.filter(i => i.status === 'bought').length;

  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Shopping List
            <ShoppingBag className="text-primary-500" size={32} />
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="primary" icon={<Clock size={14} />}>
              {pendingCount} still to buy
            </Badge>
            <Badge variant="neutral" icon={<CheckCircle2 size={14} />}>
              {boughtCount} in cart
            </Badge>
          </div>
        </div>

        <div className="flex gap-3">
          {boughtCount > 0 && (
            <Button
              onClick={clearBoughtItems}
              variant="white"
              icon={<Trash size={18} />}
              className="text-red-500 border-red-100 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          )}
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant={isAdding ? 'white' : 'primary'}
            size="lg"
            icon={isAdding ? <X size={20} /> : <Plus size={20} />}
            className="shadow-xl"
          >
            {isAdding ? 'Close' : 'Add Item'}
          </Button>
        </div>
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
                Add
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

      {/* Search Bar */}
      <div className="relative bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-transparent border-none font-bold text-slate-700 outline-none transition-all"
        />
      </div>

      {/* Simplified List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-primary-50 text-primary-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">No items found</h3>
            <p className="text-slate-400 font-medium mt-2">
              {searchQuery ? 'Try a different search term' : 'Add something to your list to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredList.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white p-4 rounded-[1.5rem] shadow-sm border transition-all duration-300 flex items-center gap-4 group ${
                  item.status === 'bought' ? 'border-slate-100 bg-slate-50/50' : 'border-slate-50 hover:border-primary-200 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleItemStatus(item)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    item.status === 'bought' 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-100 scale-110' 
                      : 'bg-slate-100 text-slate-300 hover:bg-primary-50 hover:text-primary-500'
                  }`}
                >
                  {item.status === 'bought' ? <CheckSquare size={22} strokeWidth={2.5} /> : <Square size={22} />}
                </button>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-black text-lg truncate tracking-tight transition-all ${
                      item.status === 'bought' ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'
                    }`}>
                      {item.name}
                    </h3>
                    {item.status === 'bought' && (
                      <Badge variant="success" className="text-[8px] uppercase px-2 py-0.5 animate-in fade-in zoom-in duration-300">
                        In Cart
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-0.5">
                    {item.quantity && (
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        item.status === 'bought' ? 'text-slate-300' : 'text-primary-600'
                      }`}>
                        {item.quantity}
                      </span>
                    )}
                    {item.note && (
                      <p className="text-xs text-slate-400 italic truncate font-medium">{item.note}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className={`text-[8px] px-2 py-0.5 border-none ${
                    item.status === 'bought' ? 'bg-slate-100 text-slate-300' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {item.category}
                  </Badge>
                  
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-200 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
