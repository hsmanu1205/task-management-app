import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { addTask, updateTask } from '../store/taskSlice';
import { Task } from '../types/task';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
}

export default function TaskDialog({ open, onClose, task }: TaskDialogProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (task) {
      dispatch(updateTask({
        ...task,
        ...formData,
        updatedAt: now,
      }));
    } else {
      dispatch(addTask({
        id: uuidv4(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      } as Task));
    }

    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        className: "rounded-xl backdrop-blur-lg bg-white/95"
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-bold">
          {task ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <TextField
              autoFocus
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-white/50 rounded-lg"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/50 rounded-lg"
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                className="bg-white/50 rounded-lg"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="bg-white/50 rounded-lg"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={onClose}
            className="hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            className="button-3d"
          >
            {task ? 'Update' : 'Add'} Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}