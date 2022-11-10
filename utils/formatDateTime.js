module.exports = {
    format_date_short: (date) => {
      // Format date as mm/dd/yyyy
      let EventDate = new Date(date);
      return `${new Intl.DateTimeFormat('en-US').format(EventDate)}`;
    },
  
    format_date_long: (date) => {
      // Format date as mmmm dd, yyyy
      let EventDate = new Date(date);
      return `${new Intl.DateTimeFormat(`en-US`, { month: 'long' }).format(EventDate)} ${EventDate.getDate()}, ${EventDate.getFullYear()}`;
    },
  
    format_date_time: (date) => {
      // Format date as mmmm dd, yyyy hh:mm {am/pm}
      let EventDate = new Date(date);
      return `${new Intl.DateTimeFormat(`en-US`, { month: 'long' }).format(EventDate)} ${EventDate.getDate()}, ${EventDate.getFullYear()} ${EventDate.toLocaleTimeString(`en-US`, {
        hour: '2-digit',
        minute: '2-digit'
      })}`
    }
  };