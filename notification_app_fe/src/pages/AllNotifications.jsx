import { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Alert, 
  Pagination, FormControl, InputLabel, Select, MenuItem, Paper, Grid
} from '@mui/material';
import { getNotifications } from '../services/api';
import NotificationCard from '../components/NotificationCard';

const AllNotifications = ({ viewedIds, markAsViewed }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // Filtering & Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  
  const PAGE_LIMIT = 10;
  const [totalItems, setTotalItems] = useState(50); // Hardcoded total for demo purposes

  const loadData = async () => {
    setIsLoading(true);
    setFetchError(null);
    
    try {
      const params = { 
        page: currentPage, 
        limit: PAGE_LIMIT 
      };
      
      if (selectedType) {
        params.notification_type = selectedType;
      }
      
      const data = await getNotifications(params);
      setItems(data.notifications || []);
    } catch (err) {
      setFetchError('Could not sync with the notification server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, selectedType]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1); // reset to first page when filtering
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header & Filter Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 5,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Notifications Feed
        </Typography>
        
        <Paper elevation={0} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedType}
              label="Category"
              onChange={handleTypeChange}
            >
              <MenuItem value="">All Notifications</MenuItem>
              <MenuItem value="Placement">Placements Only</MenuItem>
              <MenuItem value="Result">Exam Results</MenuItem>
              <MenuItem value="Event">Campus Events</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Box>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {fetchError}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress thickness={5} size={40} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {items.map((notif) => (
              <Grid item xs={12} key={notif.ID}>
                <NotificationCard 
                  notification={notif} 
                  isViewed={viewedIds.includes(notif.ID)}
                  onMarkViewed={markAsViewed}
                />
              </Grid>
            ))}
            
            {!items.length && (
              <Box sx={{ width: '100%', py: 10, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No notifications match your current filter.
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Pagination Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination 
              count={Math.ceil(totalItems / PAGE_LIMIT)} 
              page={currentPage} 
              onChange={(_, val) => setCurrentPage(val)} 
              color="primary" 
              variant="outlined" 
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default AllNotifications;
