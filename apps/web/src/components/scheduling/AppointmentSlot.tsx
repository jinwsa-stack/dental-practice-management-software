'use client';

import { format } from 'date-fns';
import { useState } from 'react';

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  type: string;
  status: string;
  notes?: string;
  patient: {
    first_name: string;
    last_name: string;
  };
  dentist: {
    first_name: string;
    last_name: string;
  };
}

interface AppointmentSlotProps {
  appointments: Appointment[];
  dentistId: string;
  date: Date;
  onBookSlot: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onDropAppointment: (appointmentId: string, newDentistId: string, newDate: Date) => void;
}

export function AppointmentSlot({
  appointments,
  dentistId,
  date,
  onBookSlot,
  onEditAppointment,
  onDeleteAppointment,
  onDropAppointment
}: AppointmentSlotProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const statusColors = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    completed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700',
  };

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    e.dataTransfer.setData('appointmentId', appointment.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const appointmentId = e.dataTransfer.getData('appointmentId');
    if (appointmentId) {
      onDropAppointment(appointmentId, dentistId, date);
    }
  };

  if (appointments.length === 0) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onBookSlot}
        className={`w-full min-h-[80px] p-2 text-sm text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-md transition-all cursor-pointer ${
          isDragOver
            ? 'border-blue-500 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
            : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        + Book
      </div>
    );
  }

  return (
    <div
      className="space-y-2 min-h-[80px]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`rounded-md transition-all ${
          isDragOver ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-500 dark:border-blue-400 p-1' : ''
        }`}
      >
        {appointments.map((apt) => (
          <div
            key={apt.id}
            draggable
            onDragStart={(e) => handleDragStart(e, apt)}
            onClick={() => onEditAppointment(apt)}
            className={`p-2 rounded-md border text-xs ${
              statusColors[apt.status as keyof typeof statusColors]
            } group relative cursor-move hover:opacity-80 transition-opacity mb-2 last:mb-0`}
          >
            <div className="font-medium">
              {format(new Date(apt.start_time), 'HH:mm')} -{' '}
              {format(new Date(apt.end_time), 'HH:mm')}
            </div>
            <div className="mt-1">
              {apt.patient.first_name} {apt.patient.last_name}
            </div>
            <div className="mt-1 text-xs opacity-75">{apt.type}</div>

            {/* Delete Button */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this appointment?')) {
                    onDeleteAppointment(apt.id);
                  }
                }}
                className="p-1 bg-white dark:bg-gray-800 rounded hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-300 dark:border-gray-600"
                title="Delete appointment"
              >
                <svg
                  className="w-3 h-3 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onBookSlot}
        className="w-full p-2 text-xs text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        + Add
      </button>
    </div>
  );
}
