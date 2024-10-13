import React from 'react';
import {  MenuItem, Select, FormControl, InputLabel } from '@mui/material';
const RESULTS_PER_PAGE = [5, 15, 25, 50, 100];


const ErrorComponent: React.FC = () => {
    return (
        <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: '20px' }}>
        <InputLabel id="players-per-page-label">Results per page</InputLabel>
        <Select
            labelId="players-per-page-label"
            value={playersPerPage}
            onChange={handlePlayersPerPageChange}
            label="Results per page"
        >
            {RESULTS_PER_PAGE.map((option: any) =>(
              <MenuItem value={option}> {option} </MenuItem>
            ))}
        </Select>
    </FormControl>
        </div>
    );
};

export default ErrorComponent;