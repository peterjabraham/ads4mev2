'use client';
import React from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useStore } from '@/stores';
import { format } from 'date-fns';

export const SavedHeadlines: React.FC = () => {
    const { likedHeadlines, toggleLikedHeadline } = useStore();

    const handleDelete = (headline: string) => {
        toggleLikedHeadline(headline, '');
    };

    return (
        <Box className="w-full">
            <Typography variant="h6" className="mb-4">
                Saved Headlines ({likedHeadlines.length})
            </Typography>
            {likedHeadlines.length === 0 ? (
                <Paper className="p-4">
                    <Typography color="textSecondary">
                        No saved headlines yet. Like some headlines to see them here.
                    </Typography>
                </Paper>
            ) : (
                <List>
                    {likedHeadlines.map((item) => (
                        <ListItem
                            key={item.id}
                            component={Paper}
                            sx={{ mb: 2, p: 2 }}
                        >
                            <ListItemText
                                primary={item.headline}
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            {item.primaryText}
                                        </Typography>
                                        <br />
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            color="textSecondary"
                                        >
                                            Saved on: {format(item.timestamp, 'MMM dd, yyyy HH:mm')}
                                        </Typography>
                                    </>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(item.headline)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};