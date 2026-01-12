// Todo App
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Search, Calendar, CheckCircle2, Circle, Star, Tag, Briefcase, User, ShoppingCart, Heart, Home, Zap } from 'lucide-react';

const CATEGORIES = [
  { id: 'work', name: 'Work', icon: Briefcase, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'personal', name: 'Personal', icon: User, color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'health', name: 'Health', icon: Heart, color: 'bg-red-100 text-red-700 border-red-300' },
  { id: 'home', name: 'Home', icon: Home, color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { id: 'other', name: 'Other', icon: Zap, color: 'bg-gray-100 text-gray-700 border-gray-300' }
];

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem('todos')) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        priority: priority,
        category: category,
        dueDate: dueDate,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
      setDueDate('');
      setPriority('medium');
      setCategory('personal');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toISOString() : null
      } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id) => {
    if (editValue.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editValue } : todo
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const getFilteredTodos = () => {
    return todos.filter(todo => {
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'active' ? !todo.completed :
        filter === 'completed' ? todo.completed : true;
      
      const matchesCategory = categoryFilter === 'all' ? true : todo.category === categoryFilter;
      
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesCategory && matchesSearch;
    });
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const getCategoryStats = () => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: todos.filter(t => t.category === cat.id && !t.completed).length
    }));
  };

  const getPriorityStyles = (priority) => {
    switch(priority) {
      case 'high': return {
        border: 'border-l-4 border-rose-500',
        bg: 'bg-gradient-to-r from-rose-50 to-white',
        badge: 'bg-rose-100 text-rose-700'
      };
      case 'medium': return {
        border: 'border-l-4 border-amber-500',
        bg: 'bg-gradient-to-r from-amber-50 to-white',
        badge: 'bg-amber-100 text-amber-700'
      };
      case 'low': return {
        border: 'border-l-4 border-emerald-500',
        bg: 'bg-gradient-to-r from-emerald-50 to-white',
        badge: 'bg-emerald-100 text-emerald-700'
      };
      default: return {
        border: 'border-l-4 border-gray-300',
        bg: 'bg-white',
        badge: 'bg-gray-100 text-gray-700'
      };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCategoryById = (id) => CATEGORIES.find(cat => cat.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl mb-6 overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Tasks</h1>
                <p className="text-indigo-100 text-lg">Organize your day, accomplish your goals</p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 flex-wrap">
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
                <div className="text-white/80 text-sm font-medium">Active</div>
                <div className="text-3xl font-bold text-white">{activeCount}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
                <div className="text-white/80 text-sm font-medium">Completed</div>
                <div className="text-3xl font-bold text-white">{completedCount}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
                <div className="text-white/80 text-sm font-medium">Total</div>
                <div className="text-3xl font-bold text-white">{todos.length}</div>
              </div>
            </div>
          </div>

          {/* Add Todo Form */}
          <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="What would you like to accomplish today?"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all shadow-sm"
                />
              </div>
              
              <div className="flex gap-3 flex-wrap items-center">
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-gray-400" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none bg-white font-medium"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-gray-400" />
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none bg-white font-medium"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none bg-white font-medium"
                  />
                </div>
                
                <button
                  onClick={addTodo}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white/50">
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm font-medium text-gray-600 mr-2">Filter by category:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  categoryFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({todos.length})
              </button>
              {getCategoryStats().map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all text-sm flex items-center gap-1.5 border ${
                      categoryFilter === cat.id
                        ? cat.color + ' shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {cat.name} ({cat.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 md:p-8 border-t border-gray-100 bg-white">
            <div className="flex gap-4 flex-wrap items-center">
              <div className="flex-1 min-w-[250px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your tasks..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                    filter === 'all' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                    filter === 'active' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                    filter === 'completed' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center border border-white/20">
              <div className="text-gray-400 mb-4">
                <Circle size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-xl font-medium">
                  {searchTerm || categoryFilter !== 'all' ? 'No tasks match your filters' : 'No tasks yet. Start by adding one above!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map(todo => {
                const styles = getPriorityStyles(todo.priority);
                const categoryInfo = getCategoryById(todo.category);
                const CategoryIcon = categoryInfo?.icon || Tag;
                return (
                  <div
                    key={todo.id}
                    className={`${styles.border} ${styles.bg} rounded-2xl shadow-md hover:shadow-xl transition-all transform hover:scale-[1.01] border border-gray-100/50`}
                  >
                    {editingId === todo.id ? (
                      <div className="p-5 flex gap-3">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-md"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 flex items-start gap-4">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="mt-1 flex-shrink-0"
                        >
                          {todo.completed ? (
                            <CheckCircle2 size={28} className="text-emerald-600" />
                          ) : (
                            <Circle size={28} className="text-gray-300 hover:text-indigo-400 transition-colors" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-lg font-medium mb-2 ${
                            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                          }`}>
                            {todo.text}
                          </p>
                          
                          <div className="flex flex-wrap gap-3 items-center text-sm">
                            <span className={`${categoryInfo?.color} px-3 py-1 rounded-full font-medium border flex items-center gap-1.5`}>
                              <CategoryIcon size={14} />
                              {categoryInfo?.name}
                            </span>
                            
                            <span className={`${styles.badge} px-3 py-1 rounded-full font-medium`}>
                              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                            </span>
                            
                            {todo.dueDate && (
                              <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                <Calendar size={14} />
                                <span className="font-medium">Due: {formatDate(todo.dueDate)}</span>
                              </div>
                            )}
                            
                            {todo.completedAt && (
                              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                <CheckCircle2 size={14} />
                                <span className="font-medium">Completed: {formatDateTime(todo.completedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => startEdit(todo.id, todo.text)}
                            className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors"
                            title="Edit task"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-2.5 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                            title="Delete task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}