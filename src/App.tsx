import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { Plus, Filter, ListTodo } from 'lucide-react';
import { RootState } from './store/store';
import { reorderTasks, setFilter } from './store/taskSlice';
import TaskCard from './components/TaskCard';
import TaskDialog from './components/TaskDialog';
import { Task } from './types/task';

function App() {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state: RootState) => state.tasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderTasks(items));
  };

  const filteredTasks = tasks
    .filter(task => 
      (filter.status === 'all' || task.status === filter.status) &&
      (filter.priority === 'all' || task.priority === filter.priority)
    )
    .sort((a, b) => {
      if (filter.sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  return (
    <div className="min-h-screen py-8 px-4">
      <Container maxWidth="lg">
        <Box className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-indigo-600" />
            <Typography variant="h4" component="h1" className="font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Task Management
            </Typography>
          </div>
          <Button
            variant="contained"
            className="button-3d"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add Task
          </Button>
        </Box>

        <div className="filter-card rounded-xl p-6 mb-8">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status}
                  label="Status"
                  onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
                  className="bg-white"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filter.priority}
                  label="Priority"
                  onChange={(e) => dispatch(setFilter({ priority: e.target.value }))}
                  className="bg-white"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filter.sortBy}
                  label="Sort By"
                  onChange={(e) => dispatch(setFilter({ sortBy: e.target.value as 'date' | 'priority' }))}
                  className="bg-white"
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <TaskDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </Container>
    </div>
  );
}

export default App;