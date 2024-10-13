import React  from "react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface ResultsPerPageProps {
    playersPerPage: number;
    handlePlayersPerPageChange: (event: SelectChangeEvent<number>) => void;
    options: number[];
}

const ResultsPerPage: React.FC<ResultsPerPageProps> = ({
    playersPerPage,
    handlePlayersPerPageChange,
    options,
}) => {
    return (
        <FormControl
            variant="outlined"
            style={{ minWidth: 120, marginBottom: "20px" }}
        >
          <InputLabel id="results-per-page-label">Results per page</InputLabel>
            <Select
                labelId="results-per-page-label"
                value={playersPerPage}
                onChange={handlePlayersPerPageChange}
                label="Results per page"
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))};
            </Select>
        </FormControl>
    );
};

export default ResultsPerPage;