import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Clock, Save, Loader2, ArrowLeft, Settings2 } from 'lucide-react';
import API from '../../services/api';
import CalendarPicker from '../../components/CalendarPicker';

// Mapping helper for days of the week (supports numbers 0-6 and string names)
const DAY_NAMES = {
  '0': 'Monday',
  '1': 'Tuesday',
  '2': 'Wednesday',
  '3': 'Thursday',
  '4': 'Friday',
  '5': 'Saturday',
  '6': 'Sunday',
  'monday': 'Monday',
  'tuesday': 'Tuesday',
  'wednesday': 'Wednesday',
  'thursday': 'Thursday',
  'friday': 'Friday',
  'saturday': 'Saturday',
  'sunday': 'Sunday'
};

const getDayDisplayName = (val) => {
  if (val === undefined || val === null) return 'Day';
  const strVal = String(val).toLowerCase().trim();
  return DAY_NAMES[strVal] || val;
};

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [blockedPeriods, setBlockedPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  
  // View mode: false = date blocking view (default), true = daily time ranges editor
  const [editingTimeRanges, setEditingTimeRanges] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlock, setNewBlock] = useState({
    start_time: '09:00',
    end_time: '18:00',
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
      
      const sanitizedSchedules = (schedRes.data || []).map(s => ({
        ...s,
        start_time: s.start_time || '09:00',
        end_time: s.end_time || '18:00',
        is_open: !!s.is_open
      }));

      setSchedules(sanitizedSchedules);
      setBlockedPeriods(blockRes.data || []);
    } catch (err) {
      console.error('Error loading schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const handleSaveAllSchedules = async () => {
    try {
      setSavingSchedule(true);
      await API.put('/admin/schedule-settings/', schedules);
      alert('Weekly schedule hours updated successfully!');
      fetchSchedule();
      setEditingTimeRanges(false);
    } catch (err) {
      alert('Failed to update weekly schedule.');
    } finally {
      setSavingSchedule(false);
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
      setNewBlock({
        start_time: '09:00',
        end_time: '18:00',
        block_full_day: false,
        reason: ''
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin text-luxury-pink" size={28} />
        <span className="ml-2 text-xs font-sans text-gray-500 uppercase tracking-widest">Loading schedule settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER WITH TOGGLE BUTTON */}
      <div className="bg-white p-6 border border-luxury-nude shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-luxury-black flex items-center gap-2">
            <Clock size={20} className="text-luxury-pink" /> 
            {editingTimeRanges ? 'Edit Weekly Operating Hours' : 'Studio Schedule & Date Blocking'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {editingTimeRanges 
              ? 'Modify standard opening and closing time ranges for each day of the week.' 
              : 'Block specific dates and holidays from online appointment bookings.'}
          </p>
        </div>

        <div>
          {editingTimeRanges ? (
            <button
              onClick={() => setEditingTimeRanges(false)}
              className="bg-luxury-cream text-luxury-black hover:bg-luxury-nude border border-luxury-nude font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Date Blocking
            </button>
          ) : (
            <button
              onClick={() => setEditingTimeRanges(true)}
              className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2 shadow"
            >
              <Settings2 size={16} /> Edit Daily Time Ranges
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: WEEKLY TIME RANGES EDITOR */}
      {editingTimeRanges ? (
        <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-luxury-black">Weekly Operating Hours</h3>
              <p className="text-xs text-gray-500">Configure active working hours for Monday through Sunday.</p>
            </div>
            <button
              onClick={handleSaveAllSchedules}
              disabled={savingSchedule}
              className="bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs px-6 py-3 transition-colors flex items-center gap-2 shadow"
            >
              {savingSchedule ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sched, index) => (
              <div key={sched.id || index} className="p-4 bg-luxury-cream border border-luxury-nude space-y-3">
                <div className="flex justify-between items-center">
                  <strong className="font-serif text-base text-luxury-black uppercase tracking-wider">
                    {getDayDisplayName(sched.day_of_week)}
                  </strong>
                  <div className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      id={`open-${index}`}
                      checked={!!sched.is_open}
                      onChange={(e) => handleScheduleChange(index, 'is_open', e.target.checked)}
                    />
                    <label htmlFor={`open-${index}`} className="font-semibold text-gray-700 cursor-pointer">Open</label>
                  </div>
                </div>

                {sched.is_open && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-luxury-nude/60">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase">Opening Time</label>
                      <input
                        type="time"
                        value={sched.start_time || '09:00'}
                        onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                        className="w-full p-2 border bg-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase">Closing Time</label>
                      <input
                        type="time"
                        value={sched.end_time || '18:00'}
                        onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                        className="w-full p-2 border bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // VIEW MODE 2: BLOCK SPECIFIC DATES / HOLIDAYS (DEFAULT FIRST VIEW)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-luxury-black flex items-center gap-2">
              <CalendarIcon size={16} className="text-luxury-pink" /> Block Specific Dates / Holidays
            </h3>
            <p className="text-xs text-gray-500">Select any date on the calendar to block out appointments.</p>
            <CalendarPicker
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              fullBlockedDates={allBlockedDates}
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <form onSubmit={handleCreateBlock} className="bg-white p-6 border border-luxury-nude shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-luxury-black">
                Add Block for: <span className="font-mono text-luxury-pink">{selectedDate}</span>
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
                    <label className="block text-gray-600 mb-1">Start Time Range</label>
                    <input
                      type="time"
                      value={newBlock.start_time}
                      onChange={(e) => setNewBlock({ ...newBlock, start_time: e.target.value })}
                      className="w-full p-2.5 border font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">End Time Range</label>
                    <input
                      type="time"
                      value={newBlock.end_time}
                      onChange={(e) => setNewBlock({ ...newBlock, end_time: e.target.value })}
                      className="w-full p-2.5 border font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-1">Reason / Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Studio Maintenance, Private Wedding Event"
                  value={newBlock.reason}
                  onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                  className="w-full p-2.5 border text-xs"
                />
              </div>

              <button type="submit" className="w-full bg-luxury-black text-white hover:bg-luxury-pink hover:text-luxury-black font-nav uppercase tracking-widest text-xs py-3 transition-colors">
                Save Blocked Time / Date
              </button>
            </form>

            <div className="bg-white p-6 border border-luxury-nude shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-luxury-black">Blocks on {selectedDate}</h3>
              {selectedDateBlocks.length === 0 ? (
                <p className="text-xs text-gray-400">No blocks configured for this date.</p>
              ) : (
                <div className="space-y-2">
                  {selectedDateBlocks.map(block => (
                    <div key={block.id} className="p-3 bg-luxury-cream border flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-luxury-black font-mono">{block.block_full_day ? 'Entire Day Closed' : `${block.start_time} - ${block.end_time}`}</strong>
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
      )}

    </div>
  );
}