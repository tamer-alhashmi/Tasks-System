import React, { useState } from 'react';
import { X, Send, MessageCircle, Clock, AlertTriangle } from 'lucide-react';
import { Task, Employee, TaskAssignment } from '../types';

interface TaskNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: TaskAssignment | null;
  task: Task | null;
  employee: Employee | null;
  onSendNotification: (assignmentId: string, message: string, type: 'whatsapp' | 'email') => void;
}

export const TaskNotificationModal: React.FC<TaskNotificationModalProps> = ({
  isOpen,
  onClose,
  assignment,
  task,
  employee,
  onSendNotification
}) => {
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'urgent'>('normal');
  const [isCustomMessage, setIsCustomMessage] = useState(false);

  if (!isOpen || !assignment || !task || !employee) return null;

  const predefinedMessages = {
    normal: [
      `Hi ${employee.name}, just a friendly reminder about the "${task.name}" task. Please update when you can.`,
      `Hello ${employee.name}, checking on the progress of "${task.name}". Let me know if you need any assistance.`,
      `Hi ${employee.name}, when you have a moment, could you please provide an update on "${task.name}"?`
    ],
    urgent: [
      `Hi ${employee.name}, we need to prioritize the "${task.name}" task. Please complete it as soon as possible.`,
      `URGENT: ${employee.name}, the "${task.name}" task requires immediate attention. Please respond ASAP.`,
      `Hi ${employee.name}, "${task.name}" is now high priority. Please focus on completing this task first.`
    ]
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    onSendNotification(assignment.id, message, notificationType);
    setMessage('');
    setIsCustomMessage(false);
    onClose();
  };

  const selectPredefinedMessage = (msg: string) => {
    setMessage(msg);
    setIsCustomMessage(true);
  };

  const getElapsedTime = () => {
    if (!assignment.assignedAt) return 'Unknown';
    const now = new Date();
    const assigned = new Date(assignment.assignedAt);
    const hours = Math.floor((now.getTime() - assigned.getTime()) / (1000 * 60 * 60));
    const minutes = Math.floor(((now.getTime() - assigned.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Send Task Reminder</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Task Info */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-sm sm:text-base text-gray-900">{task.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Assigned to: {employee.name}</p>
              </div>
              <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                assignment.status === 'not_started' ? 'bg-gray-100 text-gray-700' :
                assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                assignment.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {assignment.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Assigned {getElapsedTime()}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span className={`font-medium ${
                  task.priority === 'urgent' ? 'text-red-600' :
                  task.priority === 'high' ? 'text-orange-600' :
                  task.priority === 'medium' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send via
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notificationType"
                  value="whatsapp"
                  checked={notificationType === 'whatsapp'}
                  onChange={(e) => setNotificationType(e.target.value as 'whatsapp' | 'email')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">WhatsApp</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="notificationType"
                  value="email"
                  checked={notificationType === 'email'}
                  onChange={(e) => setNotificationType(e.target.value as 'whatsapp' | 'email')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Email</span>
              </label>
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="urgencyLevel"
                  value="normal"
                  checked={urgencyLevel === 'normal'}
                  onChange={(e) => setUrgencyLevel(e.target.value as 'normal' | 'urgent')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="urgencyLevel"
                  value="urgent"
                  checked={urgencyLevel === 'urgent'}
                  onChange={(e) => setUrgencyLevel(e.target.value as 'normal' | 'urgent')}
                  className="mr-2"
                />
                <span className="text-sm text-red-600 font-medium">Urgent</span>
              </label>
            </div>
          </div>

          {/* Predefined Messages */}
          {!isCustomMessage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Messages
              </label>
              <div className="space-y-2">
                {predefinedMessages[urgencyLevel].map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => selectPredefinedMessage(msg)}
                    className="w-full text-left p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-xs sm:text-sm text-gray-700"
                  >
                    {msg}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsCustomMessage(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Write custom message
              </button>
            </div>
          )}

          {/* Custom Message */}
          {isCustomMessage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                placeholder={`Write your message to ${employee.name}...`}
              />
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => {
                    setIsCustomMessage(false);
                    setMessage('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to quick messages
                </button>
                <span className="text-xs text-gray-500">
                  {message.length}/500 characters
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send {notificationType === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
            <span className="sm:hidden">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};