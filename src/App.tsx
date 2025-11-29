import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id: number) => {
    if (editingText.trim() === '') return;
    
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: editingText } : todo
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📝 My Todo List</h1>
        
        {/* Add Todo Input */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addTodo)}
            placeholder="Add a new task..."
            style={styles.input}
          />
          <button onClick={addTodo} style={styles.addButton}>
            <Plus size={20} />
            Add
          </button>
        </div>

        {/* Todo List */}
        <div style={styles.todoList}>
          {todos.length === 0 ? (
            <p style={styles.emptyMessage}>No tasks yet. Add one above! 🎯</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  ...styles.todoItem,
                  ...(todo.completed ? styles.todoItemCompleted : {}),
                }}
              >
                {editingId === todo.id ? (
                  // Edit Mode
                  <div style={styles.editContainer}>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, () => saveEdit(todo.id))}
                      style={styles.editInput}
                      autoFocus
                    />
                    <div style={styles.editActions}>
                      <button
                        onClick={() => saveEdit(todo.id)}
                        style={{ ...styles.iconButton, ...styles.saveButton }}
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ ...styles.iconButton, ...styles.cancelButton }}
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div style={styles.todoContent}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                        style={styles.checkbox}
                      />
                      <span
                        style={{
                          ...styles.todoText,
                          ...(todo.completed ? styles.todoTextCompleted : {}),
                        }}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div style={styles.actions}>
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        style={{ ...styles.iconButton, ...styles.editButton }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        style={{ ...styles.iconButton, ...styles.deleteButton }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div style={styles.stats}>
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter(t => t.completed).length}</span>
            <span>Pending: {todos.filter(t => !t.completed).length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  addButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px solid transparent',
    transition: 'all 0.3s',
  },
  todoItemCompleted: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  todoText: {
    fontSize: '16px',
    color: '#333',
    wordBreak: 'break-word',
  },
  todoTextCompleted: {
    textDecoration: 'line-through',
    color: '#999',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  },
  editButton: {
    color: '#2196f3',
  },
  deleteButton: {
    color: '#f44336',
  },
  saveButton: {
    color: '#4caf50',
  },
  cancelButton: {
    color: '#ff9800',
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
  },
  editInput: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '16px',
    border: '2px solid #667eea',
    borderRadius: '6px',
    outline: 'none',
  },
  editActions: {
    display: 'flex',
    gap: '6px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: '18px',
    padding: '40px 20px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '30px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
  },
};

export default App;