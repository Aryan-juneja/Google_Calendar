// src/app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>You are not logged in</div>;
  }

  // Create a plain user object to pass to the client component
  const plainUser = {
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    emailAddresses: user.emailAddresses.map(email => ({
      emailAddress: email.emailAddress,
    })),
  };

  return <DashboardClient user={plainUser} />;
}
