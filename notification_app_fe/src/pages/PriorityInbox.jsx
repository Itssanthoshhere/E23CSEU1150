import { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Alert, 
  Paper, Slider, Grid
} from '@mui/material';
import { getNotifications } from '../services/api';
import NotificationCard from '../components/NotificationCard';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

// Global priority config (Placement > Result > Event)
const PRIORITY_SCORES = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

const PriorityInbox = ({ viewedIds, markAsViewed }) => {
  const [data, setData] = useState([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);

  /**
   * Main logic for ranking notifications.
   * We combine the category weight with a recency factor.
   */
  const rankNotifications = (list) => {
    const now = Date.now();
    
    return list.map(item => {
      const baseWeight = PRIORITY_SCORES[item.Type] || 0;
      
      // Calculate age in seconds to handle recency tie-breaking
      const age = (now - new Date(item.Timestamp).getTime()) / 1000;
      const recencyFactor = 1 / (1 + Math.max(0, age));
      
      return { 
        ...item, 
        _rank: baseWeight + recencyFactor 
      };
    }).sort((a, b) => b._rank - a._rank);
  };

  const syncInbox = async () => {
    setBusy(true);
    setErr(null);
    try {
      // Grab a fresh batch from the API
      const response = await getNotifications({ page: 1 });
      const rawList = response.notifications || [];
      
      // Rank them using our scoring logic
      const ranked = rankNotifications(rawList);
      setData(ranked.slice(0, displayCount));
    } catch (e) {
      setErr("Inbox sync failed. The server might be under heavy load.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    syncInbox();
  }, [displayCount]);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Top Banner & Settings */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        mb: 6, 
        gap: 3 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoGraphIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Smart Priority Inbox
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Automatically surfacing what matters most to you.
            </Typography>
          </Box>
        </Box>
        
        <Paper elevation={0} sx={{ 
          p: 2.5, 
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 4, 
          width: { xs: '100%', md: 300 } 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Display Limit
            </Typography>
            <Typography variant="subtitle2" color="secondary">
              Top {displayCount}
            </Typography>
          </Box>
          <Slider
            value={displayCount}
            min={5}
            max={25}
            step={5}
            marks
            onChange={(_, v) => setDisplayCount(v)}
            color="secondary"
          />
        </Paper>
      </Box>

      {/* Logic explanation for the user */}
      <Alert severity="info" variant="outlined" sx={{ mb: 5, borderStyle: 'dashed' }}>
        Ranking algorithm: <strong>Placement &gt; Result &gt; Event</strong>. Newer items always appear first within their category.
      </Alert>

      {err && <Alert severity="error" sx={{ mb: 4 }}>{err}</Alert>}

      {busy ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 15 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data.map((item, idx) => (
            <Grid item xs={12} key={item.ID}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography variant="h5" sx={{ 
                  color: 'secondary.main', 
                  fontWeight: 900, 
                  opacity: 0.2, 
                  minWidth: 32,
                  fontStyle: 'italic'
                }}>
                  #{idx + 1}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <NotificationCard 
                    notification={item} 
                    isViewed={viewedIds.includes(item.ID)}
                    onMarkViewed={markAsViewed}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PriorityInbox;
