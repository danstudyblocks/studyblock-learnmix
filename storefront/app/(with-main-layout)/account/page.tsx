import { redirect } from 'next/navigation';

export default function AccountPage() {
  // When profile redirects here (e.g. 401), send to sign-in to avoid redirect loop.
  // Logged-in users can go directly to /profile.
  redirect('/sign-in');
}
