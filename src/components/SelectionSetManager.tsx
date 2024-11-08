import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  FormatListBulleted as ChecklistIcon,
} from '@mui/icons-material';
import { useHistoryStore, SelectionSet } from '@/stores/historyStore';
import toast from 'react-hot-toast';
import { useFormStore } from '@/stores/formStore';
import { generateId } from '@/utils/generateId';

interface SelectionSetManagerProps {
  selectedIds: Set<string>;
  onLoadSet: (ids: string[]) => void;
}

export const SelectionSetManager: React.FC<SelectionSetManagerProps> = ({
  selectedIds,
  onLoadSet,
}) => {
  const [open, setOpen] = React.useState(false);
  const [newSetName, setNewSetName] = React.useState('');
  const [editingSet, setEditingSet] = React.useState<SelectionSet | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [activeSet, setActiveSet] = React.useState<SelectionSet | null>(null);
  
  const { 
    selectionSets, 
    addSelectionSet, 
    updateSelectionSet,
    removeSelectionSet,
    importSelectionSets,
    loadSelectionSet
  } = useHistoryStore();

  const handleSaveSet = () => {
    if (!newSetName.trim()) {
      toast.error('Please enter a name for the selection set');
      return;
    }

    const currentAd = useFormStore.getState().generatedAd;
    const currentAdId = generateId();

    const idsToSave = currentAd
      ? [currentAdId, ...Array.from(selectedIds)]
      : Array.from(selectedIds);

    if (idsToSave.length === 0) {
      toast.error('Please select at least one ad to save');
      return;
    }

    if (editingSet) {
      updateSelectionSet(editingSet.id, {
        ...editingSet,
        name: newSetName.trim(),
        adIds: idsToSave,
        timestamp: Date.now(),
      });
      toast.success('Selection set updated');
    } else {
      addSelectionSet(newSetName.trim(), idsToSave);
      toast.success('Selection set saved');
    }

    setNewSetName('');
    setEditingSet(null);
  };

  const handleEdit = (set: SelectionSet) => {
    setEditingSet(set);
    setNewSetName(set.name);
    onLoadSet(set.adIds);
    setMenuAnchor(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(selectionSets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selection-sets.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Selection sets exported');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedSets = JSON.parse(content);
        importSelectionSets(importedSets);
        toast.success('Selection sets imported');
      } catch (error) {
        toast.error('Failed to import selection sets');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSet = (set: SelectionSet) => {
    loadSelectionSet(set.id);
    onLoadSet(set.adIds);
    toast.success(`Loaded selection set: ${set.name}`);
  };

  const handleClearAllSets = () => {
    if (window.confirm('Are you sure you want to delete all selection sets? This cannot be undone.')) {
      useHistoryStore.setState(state => ({ ...state, selectionSets: [] }));
      toast.success('All selection sets have been cleared');
    }
  };

  return (
    <>
      <Tooltip title="Manage Selection Sets">
        <IconButton 
          onClick={() => setOpen(true)} 
          size="small"
          sx={{ 
            padding: '5px',
            '& svg': { 
              fontSize: '1.25rem',
              color: '#9e9e9e',
              '&:hover': {
                color: '#4caf50'
              }
            }
          }}
        >
          <ChecklistIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <span>Selection Sets</span>
          {selectionSets.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleClearAllSets}
            >
              Clear All Sets
            </Button>
          )}
        </DialogTitle>
        <DialogContent>
          <Box className="mb-4">
            <Typography variant="subtitle2" className="mb-2">
              {editingSet ? 'Update Selection Set' : 'Save Current Selection'}
            </Typography>
            <Box className="flex gap-2">
              <TextField
                size="small"
                fullWidth
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                placeholder="Enter set name"
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSet}
                disabled={!newSetName.trim()}
              >
                {editingSet ? 'Update' : 'Save'}
              </Button>
              {editingSet && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingSet(null);
                    setNewSetName('');
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>

          <Box className="flex justify-between items-center mb-2">
            <Typography variant="subtitle2">
              Saved Sets
            </Typography>
            <Box>
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                id="import-file"
                onChange={handleImport}
              />
              <Tooltip title="Import Sets">
                <IconButton size="small" onClick={() => document.getElementById('import-file')?.click()}>
                  <ImportIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Sets">
                <IconButton size="small" onClick={handleExport}>
                  <ExportIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <List>
            {selectionSets.map((set) => (
              <ListItem
                key={set.id}
                button
                onClick={() => handleLoadSet(set)}
              >
                <ListItemText
                  primary={set.name}
                  secondary={`${set.adIds.length} ads • Saved ${new Date(set.timestamp).toLocaleString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      setActiveSet(set);
                      setMenuAnchor(e.currentTarget);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {selectionSets.length === 0 && (
              <Typography variant="body2" color="textSecondary" className="text-center p-4">
                No saved selection sets
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setActiveSet(null);
        }}
      >
        <MenuItem onClick={() => activeSet && handleEdit(activeSet)}>
          <EditIcon className="mr-2" /> Edit
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (activeSet) {
              removeSelectionSet(activeSet.id);
              toast.success('Selection set removed');
            }
            setMenuAnchor(null);
            setActiveSet(null);
          }}
          className="text-red-500"
        >
          <DeleteIcon className="mr-2" /> Delete
        </MenuItem>
      </Menu>
    </>
  );
}; 