'use client';

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { FullCardType as Card } from '@/lib/tarot-types';

// Define astral colors (can be imported from a shared config later if needed)
const astralColors = {
  dark: '#0F0F2B',
  bg: '#1A1A3D',
  light: '#E0E0FF',
  purple: '#7E57C2',
  blue: '#3D5AFE',
  gold: '#FFCA28',
  shadowBlue: '#2C2C54',
};

// Create a dedicated MUI theme for the CardPicker
const cardPickerTheme = createTheme({
  palette: {
    mode: 'dark', // Essential for dark theme components
    primary: {
      main: astralColors.purple, // Use esoteric-purple for primary actions/focus
    },
    background: {
      paper: astralColors.shadowBlue, // Background for dropdown/paper elements
    },
    text: {
      primary: astralColors.light, // Main text color
      secondary: astralColors.light, // Secondary text color (e.g., placeholder)
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: astralColors.shadowBlue,
            color: astralColors.light,
            '& fieldset': {
              borderColor: astralColors.purple + '80', // purple with opacity
            },
            '&:hover fieldset': {
              borderColor: astralColors.purple,
            },
            '&.Mui-focused fieldset': {
              borderColor: astralColors.gold, // Gold for focused state
            },
          },
          '& .MuiInputLabel-root': {
            color: astralColors.light + 'B3', // light with opacity for label
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: astralColors.gold,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          // Styles for the Autocomplete wrapper itself if needed
        },
        paper: { // Styles for the dropdown suggestion box
          backgroundColor: astralColors.bg, 
          border: `1px solid ${astralColors.purple}80`,
        },
        option: { // Styles for each option in the dropdown
          color: astralColors.light,
          backgroundColor: astralColors.bg, // Ensure options have the right bg
          '&[aria-selected="true"]': {
            backgroundColor: astralColors.purple + '4D', // purple with more opacity for selected
            color: astralColors.gold,
          },
          '&:hover': {
            backgroundColor: astralColors.shadowBlue, // Hover state for options
          },
        },
        popupIndicator: { // Arrow icon
          color: astralColors.light + 'B3',
        },
        clearIndicator: { // Clear icon (X)
          color: astralColors.light + 'B3',
        },
        tag: { // Styles for the selected item tags
          backgroundColor: astralColors.purple,
          color: astralColors.dark, // Dark text on purple tags for contrast
          '& .MuiChip-deleteIcon': {
            color: astralColors.dark + 'B3',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: astralColors.light + 'B3',
          '&.Mui-checked': {
            color: astralColors.gold, // Gold for checked checkboxes
          },
        },
      },
    },
    // You might need to style MuiChip if it's used for selected items (tags)
    MuiChip: {
        styleOverrides: {
            root: {
                backgroundColor: astralColors.purple,
                color: astralColors.dark, // High contrast text on chip
                fontWeight: 'bold',
            },
            deleteIcon: {
                color: astralColors.dark + '99', // Opacity for delete icon
                '&:hover': {
                    color: astralColors.dark,
                }
            }
        }
    }
  },
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface CardPickerProps {
  allCards: readonly Card[]; // All available cards to pick from
  selectedCards: Card[]; // Currently selected cards
  setSelectedCards: (cards: Card[]) => void; // Callback to update parent
  label?: string;
  placeholder?: string;
  limit?: number; // Optional limit for number of selected cards
}

export default function CardPicker({
  allCards,
  selectedCards,
  setSelectedCards,
  label = "Select Tarot Cards",
  placeholder = "Choose cards...",
  limit,
}: CardPickerProps) {
  const handleChange = (
    event: React.SyntheticEvent,
    newValue: Card[],
  ) => {
    if (limit && newValue.length > limit) {
      // If a limit is set and the new selection exceeds it,
      // trim the selection to the limit.
      // This simple version just takes the first `limit` items.
      // You might want more sophisticated logic (e.g., prevent adding more than limit).
      setSelectedCards(newValue.slice(0, limit));
    } else {
      setSelectedCards(newValue);
    }
  };

  return (
    <ThemeProvider theme={cardPickerTheme}>
      <div className="w-full max-w-2xl mx-auto">
        <Autocomplete
          multiple
          id="tarot-card-picker"
          options={allCards}
          value={selectedCards}
          onChange={handleChange}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected }) => {
            const { key, ...restProps } = props;
            return (
              <li key={key} {...restProps}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} className="mr-2" />
                <span className="text-sm">
                  {option.name} <span className="text-astral-light/70">({option.suit})</span>
                </span>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label={label} 
              placeholder={placeholder}
            />
          )}
        />
      </div>
    </ThemeProvider>
  );
} 