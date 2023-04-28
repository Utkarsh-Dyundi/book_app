import { createServerSupabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Registration from '../components/Registration'
import SignIn from '../components/SignIn'



type Props = {}


export default function SignInUser({ }: Props) {

  const router = useRouter();
  const supabaseClient = useSupabaseClient();


  return (
    <div className=' h-screen'>
      <Head>
        <title>
          SignIn: 7svar
        </title>
        <meta
          name="description"
          content="An online music learning platform which solves 3I's. Enroll now and find the music within you.."
          key="desc"
        />
        <link rel="icon" href="7svar1.png" />
      </Head>
      <SignIn />
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: '/profile/dashboard',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
    }
  };
}