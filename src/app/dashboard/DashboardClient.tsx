'use client'; 

import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';

interface DashboardClientProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    emailAddresses: { emailAddress: string }[];
  } | null; 
}

const DashboardClient: React.FC<DashboardClientProps> = ({ user }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false); 
  const [eventDetails, setEventDetails] = useState({ name: '', date: '', time: '' });
  const accessToken = "ya29.a0AeDClZDmABzBSrIF_vg2yRtJsRju60UIRNSg7iwt1Xasd26u3b5hp2OlJBwyFs2lbigE34UOOFK6EvuzkINDkYVcWOWAdz431I6rwmhqgatRUXeoBwPeO_55tqeQIfikdBpDqIUSTIJSbIThX10X2OfQbMBS2NtXSA_3htcTaCgYKAbcSARESFQHGX2MiRosHainSxJVOILWW60eIRQ0175";

  const fetchCalendarEvents = async (token: string) => {
    console.log("Fetching calendar events");
    try {
      const response = await fetch('/api/calendar/events', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await response.json();
      setEvents(data); // Set events to state
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const handleGoogleSignIn = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` + 
      `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&`+
      `response_type=code&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar')}`;
    window.location.href = googleAuthUrl; 
  };

  const createEvent = async () => {
    console.log("Creating event with details:", eventDetails);
    const { name, date, time } = eventDetails;

    const eventDateTime = `${date}T${time}:00`;

    const eventStartTime = toZonedTime(eventDateTime, 'Asia/Kolkata');
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000); // 1 hour duration
    const displayEventTime=new Date(eventStartTime.getTime() )
    const displayEndTime=new Date(eventEndTime.getTime());
    

    const eventStartUTC = new Date(eventStartTime.getTime() + (5.5 * 60 * 60 * 1000)); 
    const eventEndUTC = new Date(eventEndTime.getTime() + (5.5 * 60 * 60 * 1000)); 

    const event = {
        summary: name,
        start: {
            dateTime: eventStartUTC.toISOString(),
            timeZone: 'Asia/Kolkata', 
        },
        end: {
            dateTime: eventEndUTC.toISOString(), 
            timeZone: 'Asia/Kolkata', 
        },
    };
    const Displayevent = {
      summary: name,
      start: {
          dateTime: displayEventTime.toISOString(),
          timeZone: 'Asia/Kolkata', 
      },
      end: {
          dateTime: displayEndTime.toISOString(), 
          timeZone: 'Asia/Kolkata', 
      },
  };
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, Displayevent]);
      setModalOpen(false); 
      setEventDetails({ name: '', date: '', time: '' }); 
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCalendarEvents(accessToken); 
    }
  }, [accessToken]);

  if (!user) {
    return (
      <div className='mt-10 text-start max-w-xl mx-auto bg-neutral-200 p-5 rounded'>
        <h1 className='text-4xl font-bold'>User Data Not Available</h1>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className='mt-10 text-start max-w-xl mx-auto bg-neutral-200 p-5 rounded'>
      <h1 className='text-4xl font-bold'>Welcome</h1>
      <ul className='list-none mt-10'>
        <li className='mb-2'>
          <span className='font-semibold'>First Name:</span> {user.firstName ?? 'N/A'}
        </li>
        <li className='mb-2'>
          <span className='font-semibold'>Last Name:</span> {user.lastName ?? 'N/A'}
        </li>
        <li className='mb-2'>
          <span className='font-semibold'>Email:</span>{' '}
          {user.emailAddresses[0]?.emailAddress ?? 'N/A'}
        </li>
      </ul>
      <button
        onClick={handleGoogleSignIn}
        className='mt-5 mb-4 mr-5 p-2 bg-blue-500 text-white rounded'
      >
        Provide Calendar access
      </button>
      <button
        onClick={() => setModalOpen(true)}
        className='mt-5 p-2 bg-blue-500 text-white rounded'
      >
        Create Calendar Event
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-lg font-bold">Create Event</h2>
            <input
              type="text"
              placeholder="Event Name"
              value={eventDetails.name}
              onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
              className="border p-2 rounded mt-2 w-full"
            />
            <input
              type="date"
              value={eventDetails.date}
              onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
              className="border p-2 rounded mt-2 w-full"
            />
            <input
              type="time"
              value={eventDetails.time}
              onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
              className="border p-2 rounded mt-2 w-full"
            />
            <button
              onClick={createEvent}
              className="mt-4 p-2 bg-green-500 text-white rounded"
            >
              Create Event
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-2 p-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {events?.length > 0 ? (
        <table className="mt-5 w-full border border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Event Name</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: any, index) => (
              <tr key={index}>
                <td className="border p-2">{event.summary}</td>
                <td className="border p-2">{new Date(event.start.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                <td className="border p-2">{new Date(event.end.dateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-5">No upcoming events found.</p>
      )}
    </div>
  );
};

export default DashboardClient;
