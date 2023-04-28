import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { createServerSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'

import Head from 'next/head'
import { useUser } from '../../utils/useUser'
import Link from 'next/link'


type Props = {
  initialSession: Session
}

function Dashboard({ initialSession }: Props) {

  const { userDetails, isLoading, user, subscription } = useUser();
  const supabase = useSupabaseClient();
  const isSession = initialSession == null ? false : true;
  const teacherCheck = userDetails?.role;
  const isTeacher = teacherCheck == 'teacher' ? true : false;

  return (
    <div className='bg-gradient-to-r from-[#B0F3F1] to-[#FFCFDF] snap-y snap-mandatory overflow-y-scroll 
    overflow-x-hidden z-0 scrollbar scrollbar-track-gray-500/40 scrollbar-thumb-[#f7ab0a]/40 h-screen'>
      <Head>
        <title>
          Dashboard: 7svar
        </title>
        <meta
          name="description"
          content="An online music learning platform which solves 3I's. Enroll now and find the music within you.."
          key="desc"
        />
        <link rel="icon" href="7svar1.png" />
      </Head>
      <h1 className='text-red-600 text-7xl text-center mt-24'>Dashboard for {userDetails?.email}</h1>
    </div>
  )
}
export default Dashboard

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};