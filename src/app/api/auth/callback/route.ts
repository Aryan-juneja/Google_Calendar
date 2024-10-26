
// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'
import axios from 'axios';  
import {connect} from '../../../../Utils/db'
import User from '@/model/userModel';
import UserModel from '@/model/userModel';
export async function GET(request: Request) {
    const { userId } = await auth()
    const user = await currentUser()
    console.log(user)
    console.log("Received OAuth callback");
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code'); // Extract code from the query parameters
    console.log('Authorization code:', code);
    if (!code) {
        console.error('Authorization code not found');
        return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
    }
    try {
        await connect();
        // Exchange the authorization code for an access token
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: "413234840872-a68qh5oa4vcb2fa7l5nu90f34962gh2h.apps.googleusercontent.com",
                client_secret:"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",
                redirect_uri: "http://localhost:3000/api/auth/callback",
                grant_type: 'authorization_code',
            },
        });
        const { access_token } = response.data;
        // if(user!=null){
        //     const data =new User(
        //         user.firstName,
        //         user.emailAddresses[0].emailAddress,
        //         access_token
        //     )
        //     await data.save()
        //     console.log("data saved successfully")
        // }
        console.log(response.data)
        console.log('Access token obtained:', access_token);
         const res = NextResponse.redirect(new URL('/dashboard', request.url));
        res.cookies.set('access_token', access_token, {
            httpOnly: true, // Prevent client-side access to the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 60 * 60 * 24, // 1 day
            path: '/', // Cookie path
        });
        return res;
    } catch (error: any) {
        console.error('Error exchanging code for access token:', error.response ? error.response.data : error.message);
        return NextResponse.json({ error: 'Failed to exchange code for access token' }, { status: 500 });
    }
}
