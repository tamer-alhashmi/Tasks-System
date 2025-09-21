import React, { useState } from 'react';
import { X, User, Calendar, Clock, UserX } from 'lucide-react';
import { Task, Employee } from '../types';

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  employees: Employee[];
  assignments: TaskAssignment[];
  onAssign: (taskId: string, employeeId: string) => void;
  onUnassign?: (taskId: string) => void;
}

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isOpen,
  onClose,
  task,
  employees,
  assignments,
  onAssign,
  onUnassign
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');

  if (!isOpen || !task) return null;

  // Check if task is already assigned
  const currentAssignment = assignments.find(a => a.taskId === task.id && a.date === new Date().toISOString().split('T')[0]);
  const currentEmployee = currentAssignment ? employees.find(e => e.id === currentAssignment.employeeId) : null;

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task.id, selectedEmployee);
      setSelectedEmployee('');
      onClose();
    }
  };

  const handleUnassign = () => {
    if (onUnassign && currentAssignment) {
      onUnassign(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {currentAssignment ? 'Reassign Task' : 'Assign Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {currentAssignment && currentEmployee && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Currently assigned to: <strong>{currentEmployee.name}</strong>
              </p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{task.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">{task.description}</p>
            
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Est. {task.estimatedMinutes}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className={`font-medium ${
                  task.priority === 'urgent' ? 'text-red-600' :
                  task.priority === 'high' ? 'text-orange-600' :
                  task.priority === 'medium' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {currentAssignment ? 'Reassign to Employee' : 'Assign to Employee'}
            </label>
            <div className="space-y-2">
              {employees.filter(emp => emp.isActive).map(employee => (
                <label
                  key={employee.id}
                  className={`flex items-center p-2 sm:p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentEmployee?.id === employee.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="employee"
                    value={employee.id}
                    checked={selectedEmployee === employee.id}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="mr-2 sm:mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm sm:text-base text-gray-900">{employee.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{employee.role}</div>
                        {currentEmployee?.id === employee.id && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {currentAssignment && onUnassign && (
              <button
                onClick={handleUnassign}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                <UserX className="w-4 h-4" />
                Unassign
              </button>
            )}
            
            <button
              onClick={handleAssign}
              disabled={!selectedEmployee}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {currentAssignment ? 'Reassign Task' : 'Assign Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};