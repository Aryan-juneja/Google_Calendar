const handleGoogleSignIn = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=413234840872-a68qh5oa4vcb2fa7l5nu90f34962gh2h.apps.googleusercontent.com&` + 
      `redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/callback')}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar')}`;

    window.location.href = googleAuthUrl; // Redirect to Google OAuth
  };

  const fetchCalendarEvents = async (token: string) => {
    try {
      const response = await fetch('/api/calendar/events', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the access token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      // setEvents(data); // Set events to state
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };