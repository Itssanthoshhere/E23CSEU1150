import { 
  Card, CardContent, Typography, Box, Chip, IconButton, Tooltip 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CelebrationIcon from '@mui/icons-material/Celebration';
import InfoIcon from '@mui/icons-material/Info';

// Helper for mapping category types to icons and colors
const getCategoryDetails = (type) => {
  switch (type) {
    case 'Placement':
      return { color: 'error', icon: <WorkIcon fontSize="small" /> };
    case 'Result':
      return { color: 'warning', icon: <AssignmentIcon fontSize="small" /> };
    case 'Event':
      return { color: 'info', icon: <CelebrationIcon fontSize="small" /> };
    default:
      return { color: 'default', icon: <InfoIcon fontSize="small" /> };
  }
};

const NotificationCard = ({ notification, isViewed, onMarkViewed }) => {
  const { color, icon } = getCategoryDetails(notification.Type);
  
  const handleCardClick = () => {
    if (!isViewed) {
      onMarkViewed(notification.ID);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
        },
        opacity: isViewed ? 0.65 : 1,
        borderLeft: (theme) => `6px solid ${isViewed ? theme.palette.action.disabled : theme.palette[color].main}`,
        position: 'relative',
        borderRadius: 3
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Chip 
            icon={icon} 
            label={notification.Type} 
            size="small" 
            color={color}
            variant={isViewed ? 'outlined' : 'filled'}
            sx={{ fontWeight: 600 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isViewed && (
              <Chip label="NEW" size="small" color="primary" sx={{ height: 20, px: 0.5, fontSize: '0.65rem', fontWeight: 900 }} />
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 12 }} />
              {new Date(notification.Timestamp).toLocaleDateString()} {new Date(notification.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ 
          fontWeight: isViewed ? 400 : 700, 
          mb: 1,
          lineHeight: 1.4,
          color: isViewed ? 'text.secondary' : 'text.primary'
        }}>
          {notification.Message}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Tooltip title={isViewed ? "Seen" : "Mark as read"}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
              {isViewed ? <VisibilityIcon fontSize="small" sx={{ opacity: 0.5 }} /> : <VisibilityOffIcon fontSize="small" color="primary" />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
