'use client';
import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Typography,
} from '@mui/material';
import { useStore } from '@/stores';
import { FormState } from '@/stores';
import toast from 'react-hot-toast';

interface Template {
    id: string;
    name: string;
    fields: Partial<FormState>;
    savedAt: number;
}

export const TemplateSelector: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
    const setField = useStore((state) => state.setField);
    const isSubmitting = useStore((state) => state.isSubmitting);

    // Load templates from localStorage
    const loadTemplates = (): Template[] => {
        const stored = localStorage.getItem('ad-templates');
        return stored ? JSON.parse(stored) : [];
    };

    const templates = React.useMemo(loadTemplates, []);

    const applyTemplate = (template: Template) => {
        Object.entries(template.fields).forEach(([field, value]) => {
            setField(field as keyof FormState, value);
        });
        setOpen(false);
        toast.success(`Template "${template.name}" applied`);
    };

    return (
        <Box sx={{ marginBottom: '30px' }}>
            <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                disabled={isSubmitting}
                fullWidth
            >
                Load Template
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Select a Template</DialogTitle>
                <DialogContent>
                    {templates.length === 0 ? (
                        <Typography variant="body2" color="textSecondary" className="text-center py-4">
                            No templates saved yet
                        </Typography>
                    ) : (
                        <List>
                            {templates.map((template) => (
                                <ListItem
                                    key={template.id}
                                    disablePadding
                                    selected={selectedTemplate?.id === template.id}
                                >
                                    <ListItemButton
                                        onClick={() => setSelectedTemplate(template)}
                                    >
                                        <ListItemText
                                            primary={template.name}
                                            secondary={new Date(template.savedAt).toLocaleDateString()}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => selectedTemplate && applyTemplate(selectedTemplate)}
                        variant="contained"
                        disabled={!selectedTemplate}
                    >
                        Apply Template
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};