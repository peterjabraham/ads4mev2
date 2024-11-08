"use client";

import React from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useStore } from "@/stores";
import { useHistoryStore } from "@/stores/historyStore";
import { KeywordsField } from "@/components/form/KeywordsField";
import type { FormState, ToneType, StoreState } from '@/stores';
import toast from "react-hot-toast";
import { LikedAdsManager } from "./LikedAdsManager";

type FormField = {
  name: keyof FormState;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
};

const toneOptions: ToneType[] = [
  "professional",
  "casual",
  "excited",
  "urgent",
  "friendly",
  "authoritative"
];

export const AdForm: React.FC = () => {
  const {
    isSubmitting,
    setField,
    resetForm,
    brandName,
    product,
    userBenefit,
    promotion,
    audience,
    goal,
    keywords,
    additionalRules,
    useLikedHeadlines,
    likedHeadlines,
    tone,
  } = useStore((state: StoreState) => ({
    isSubmitting: state.isSubmitting,
    setField: state.setField,
    resetForm: state.resetForm,
    brandName: state.brandName,
    product: state.product,
    userBenefit: state.userBenefit,
    promotion: state.promotion,
    audience: state.audience,
    goal: state.goal,
    keywords: state.keywords,
    additionalRules: state.additionalRules,
    useLikedHeadlines: state.useLikedHeadlines,
    likedHeadlines: state.likedHeadlines,
    tone: state.tone,
  }));

  const { addToHistory } = useHistoryStore();

  const formFields: FormField[] = [
    { name: "campaignName", label: "Campaign Name", required: true },
    { name: "campaignDate", label: "Campaign Date", required: true },
    { name: "brandName", label: "Brand Name", required: true },
    { name: "product", label: "Product/Service", required: true },
    { name: "userBenefit", label: "User Benefit", required: true },
    { name: "promotion", label: "Promotion Details" },
    { name: "audience", label: "Target Audience", required: true },
    { name: "goal", label: "Campaign Goal", required: true },
    {
      name: "additionalRules",
      label: "Additional Rules or Guidelines",
      multiline: true,
      rows: 4,
      helperText: "Add any specific requirements or guidelines for the ad",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setField("isSubmitting", true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          product,
          userBenefit,
          promotion,
          audience,
          goal,
          keywords,
          additionalRules,
          tone,
          useLikedHeadlines,
          likedHeadlines,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate ad");
      }

      setField("generatedAd", data.generatedAd);
      addToHistory({
        originalInput: {
          brandName,
          product,
          userBenefit,
          promotion,
          audience,
          goal,
          keywords,
          additionalRules,
          tone,
          title: "",
          description: "",
          targetAudience: audience,
        },
        generatedContent: data.generatedAd,
      });

      toast.success("Ad generated successfully!");
    } catch (error) {
      console.error("Error generating ad:", error);
      toast.error("Failed to generate ad. Please try again.");
    } finally {
      setField("isSubmitting", false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {formFields.map((field) => (
        <TextField
          key={field.name}
          fullWidth
          label={field.label}
          value={useStore.getState()[field.name] as string}
          onChange={(e) => setField(field.name, e.target.value)}
          required={field.required}
          multiline={field.multiline}
          rows={field.rows}
          helperText={field.helperText}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />
      ))}

      <KeywordsField
        disabled={isSubmitting}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tone</InputLabel>
        <Select
          value={tone}
          label="Tone"
          onChange={(e) => setField("tone", e.target.value as ToneType)}
          disabled={isSubmitting}
        >
          {toneOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={useLikedHeadlines}
            onChange={(e) => setField("useLikedHeadlines", e.target.checked)}
            disabled={isSubmitting}
          />
        }
        label="Use liked headlines as examples"
        sx={{ mb: 2 }}
      />

      {useLikedHeadlines && <LikedAdsManager />}

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Generating..." : "Generate Ad"}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => resetForm()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default AdForm;