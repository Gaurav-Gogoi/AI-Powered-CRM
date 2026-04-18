import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fillForm, editForm } from './store';

function App() {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form);
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Log interaction details here. E.g., "Met Dr. Smith, sentiment was positive..."' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput) return;

    // Add user message to UI
    const newMessages = [...messages, { role: 'user', text: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setLoading(true);

    try {
      // Send to FastAPI
      const res = await axios.post('https://ai-powered-crm-1.onrender.com/api/chat', { message: chatInput });
      
      // Add AI reply to UI
      setMessages([...newMessages, { role: 'ai', text: res.data.reply || "Done!" }]);

      // MAGIC: Did the backend tell us to update the form?
      if (res.data.form_update) {
        if (res.data.form_update.action === 'FILL_FORM') {
          dispatch(fillForm(res.data.form_update.data));
        } else if (res.data.form_update.action === 'EDIT_FORM') {
          dispatch(editForm(res.data.form_update));
        }
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'ai', text: 'Error connecting to server.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4 font-sans">
      
      {/* LEFT SIDE: THE FORM (READ ONLY) */}
      <div className="w-1/2 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Interaction Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">HCP Name</label>
            <input readOnly value={formData.hcp_name} className="w-full mt-1 p-2 bg-gray-50 border rounded-md text-gray-700" placeholder="Auto-filled by AI..." />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600">Interaction Type</label>
            <input readOnly value={formData.interaction_type} className="w-full mt-1 p-2 bg-gray-50 border rounded-md text-gray-700" placeholder="Auto-filled by AI..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Sentiment</label>
            <input readOnly value={formData.sentiment} className="w-full mt-1 p-2 bg-gray-50 border rounded-md text-gray-700" placeholder="Auto-filled by AI..." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Notes / Discussion</label>
            <textarea readOnly value={formData.notes} rows="4" className="w-full mt-1 p-2 bg-gray-50 border rounded-md text-gray-700" placeholder="Auto-filled by AI..."></textarea>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200">
            <strong>Rule Enforced:</strong> You cannot type in these fields. You must ask the AI to fill them.
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE AI CHAT */}
      <div className="w-1/2 bg-white rounded-lg shadow-md flex flex-col">
        <div className="p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">🤖 AI Assistant</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`p-3 rounded-lg max-w-[80%] shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                 {msg.text}
               </div>
             </div>
          ))}
          {loading && <div className="text-gray-500 text-sm italic">AI is thinking...</div>}
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white border-t rounded-b-lg flex gap-2">
          <input 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the interaction..."
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition">
            Send
          </button>
        </form>
      </div>

    </div>
  );
}

export default App;