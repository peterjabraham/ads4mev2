'use client';
import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useStore } from '@/stores';
import { LoadingAnimation } from './LoadingAnimation';
import { Save as SaveIcon, ThumbUp as LikeIcon } from '@mui/icons-material';

export const Preview: React.FC = () => {
    const {
        isSubmitting,
        generatedAd,
        toggleLikedHeadline,
        setField,
        campaignName,
        campaignDate,
        brandName,
        product,
    } = useStore((state) => ({
        isSubmitting: state.isSubmitting,
        generatedAd: state.generatedAd,
        toggleLikedHeadline: state.toggleLikedHeadline,
        setField: state.setField,
        campaignName: state.campaignName,
        campaignDate: state.campaignDate,
        brandName: state.brandName,
        product: state.product,
    }));

    const handleSaveAd = () => {
        if (generatedAd) {
            const savedAd = {
                id: Date.now().toString(),
                headline: generatedAd.headline,
                primaryText: generatedAd.primaryText,
                timestamp: Date.now(),
                campaignName,
                campaignDate,
                brandName,
                product,
            };
            setField('savedAds', [...useStore.getState().savedAds, savedAd]);
        }
    };

    const handleLikeHeadline = () => {
        if (generatedAd) {
            toggleLikedHeadline(generatedAd.headline, generatedAd.primaryText);
        }
    };

    return (
        <Box className="w-full">
            {isSubmitting && <LoadingAnimation />}

            {generatedAd && !isSubmitting && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-[30px]"
                >
                    <Paper className="p-6 bg-white" sx={{ marginBottom: '15px' }}>
                        <Box className="flex justify-between items-start">
                            <Box className="flex-grow">
                                <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                    className="mb-4 font-bold"
                                >
                                    Generated Ad
                                </Typography>
                                <Box className="px-[20px] py-5">
                                    <Typography variant="body1" className="mb-6">
                                        <span className="text-gray-500">Headline: </span>
                                        <span className="font-bold text-[13px]">{generatedAd.headline}</span>
                                    </Typography>
                                    <Typography variant="body1" className="mb-6">
                                        <span className="text-gray-500">Primary Text: </span>
                                        <span className="font-bold text-[13px]">{generatedAd.primaryText}</span>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box className="flex gap-2">
                                <Button
                                    startIcon={<LikeIcon />}
                                    onClick={handleLikeHeadline}
                                    variant="outlined"
                                    size="small"
                                >
                                    Like
                                </Button>
                                <Button
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveAd}
                                    variant="contained"
                                    size="small"
                                >
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>
            )}
        </Box>
    );
};