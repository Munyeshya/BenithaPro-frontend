import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import API from '../../services/api';
import CalendarPicker from '../../components/CalendarPicker';

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [blockedPeriods, setBlockedPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlock, setNewBlock] = useState({
    start_time: '09:00',
    end_time: '12:00',
    block_full_day: false,
    reason: ''
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const [schedRes, blockRes] = await Promise.all([
        API.get('/admin/schedule-settings/'),
        API.get('/admin/blocked-periods/')
      ]);
      setSchedules(schedRes.data);
      setBlockedPeriods(blockRes.data);
    } catch (err) {
      console.error('Error loading schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date on the calendar.');
      return;
    }
    try {
      await API.post('/admin/blocked-periods/', {
        ...newBlock,
        blocked_date: selectedDate
      });
      fetchSchedule();
      alert('Blocked period successfully added!');
    } catch (err) {
      alert('Failed to block period.');
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!window.confirm('Remove this block?')) return;
    try {
      await API.delete(`/admin/blocked-periods/${id}/`);
      fetchSchedule();
    } catch (err) {
      alert('Failed to delete block.');
    }
  };

  const allBlockedDates = Array.from(new Set(blockedPeriods.map(b => b.blocked_date)));
  const selectedDateBlocks = blockedPeriods.filter(b => b.blocked_date === selectedDate);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 border border-luxury-nude shadow-sm">
        <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
          <CalendarIcon size={20} className="text-luxury-pink" /> Studio Operating Hours & Blocked Periods
        </h2>
        <p className="text-xs text-gray-500 mt-1">Manage weekly schedule rules and block specific dates or times from online bookings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-luxury-black">Select Date to Block / Manage</h3>
          <CalendarPicker
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            fullBlockedDates={allBlockedDates}
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleCreateBlock} className="bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-luxury-black flex items-center gap-2">
              <Plus size={16} className="text-luxury-pink" /> Add Block for: <span className="font-mono text-luxury-pink">{selectedDate}</span>
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="fullDay"
                checked={newBlock.block_full_day}
                onChange={(e) => setNewBlock({ ...newBlock, block_full_day: e.target.checked })}
              />
              <label htmlFor="fullDay" className="font-semibold text-gray-700 cursor-pointer">Block Entire Day</label>
            </div>

            {!newBlock.block_full_day && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newBlock.start_time}
                    onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                    className="w-full p-2.5 border"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newBlock.end_time}
                    onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                    className="w-full p-2.5 border"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-600 mb-1">Reason (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Studio Maintenance, Private Event"
                value={newBlock.reason}
                onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                className="w-full p-2.5 border text-xs"
              />
            </div>

            <button type="submit" className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs py-3 transition-colors">
              Save Blocked Period
            </button>
          </form>

          <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-luxury-black">Existing Blocks on {selectedDate}</h3>
            {selectedDateBlocks.length === 0 ? (
              <p className="text-xs text-gray-400">No blocks configured for this date.</p>
            ) : (
              <div className="space-y-2">
                {selectedDateBlocks.map(block => (
                  <div key={block.id} className="p-3 bg-luxury-cream border flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-luxury-black">{block.block_full_day ? 'Entire Day Closed' : `${block.start_time} - ${block.end_time}`}</strong>
                      <p className="text-gray-500 text-[10px]">{block.reason || 'No reason provided'}</p>
                    </div>
                    <button onClick={() => handleDeleteBlock(block.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}