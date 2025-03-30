import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { Task } from '../types/task';
import { deleteTask } from '../store/taskSlice';
import TaskDialog from './TaskDialog';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

const statusColors = {
  'todo': 'default',
  'in-progress': 'primary',
  'completed': 'success',
};

export default function TaskCard({ task }: TaskCardProps) {
  const dispatch = useDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <Card className="task-card group">
        <CardContent className="relative">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <Box className="flex justify-between items-start pr-8">
            <div className="flex-1">
              <Typography variant="h6" component="h2" className="mb-2 font-semibold">
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-4">
                {task.description}
              </Typography>
            </div>
            <div className="flex space-x-1">
              <IconButton
                size="small"
                onClick={() => setIsEditDialogOpen(true)}
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => dispatch(deleteTask(task.id))}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>
          </Box>
          <Box className="flex gap-2 mt-4">
            <Chip
              label={task.status.replace('-', ' ')}
              color={statusColors[task.status] as any}
              size="small"
              className="capitalize"
            />
            <Chip
              label={task.priority}
              color={priorityColors[task.priority] as any}
              size="small"
              className="capitalize"
            />
            <Typography variant="caption" color="text.secondary" className="ml-auto">
              {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <TaskDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={task}
      />
    </>
  );
}