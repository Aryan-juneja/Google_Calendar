    // src/app/api/calendar/events/route.ts
    import { NextResponse } from 'next/server';
    import axios from 'axios';

    export async function POST(request: Request) {
        console.log("Backend object")
    const { summary, start, end } = await request.json();
    let authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.split(' ')[1]; // This gets the actual token
    console.log(accessToken)
    try {
        const response = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        summary,
        start,
        end,
        }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        });
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
    }
    }
