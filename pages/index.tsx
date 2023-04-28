import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  const login = () => {
    router.push('/login')
  }
  const signUp = () => {
    router.push('/signup')
  }
  return (
    <main
      className={`flex min-h-screen flex-col  ${inter.className}`}
    >
      <h1 className="text-4xl font-bold text-center">Home</h1>
      <button onClick={login} className='mt-10 b-2 border-l-pink-400 text-red-600'>Login</button>
      <button onClick={signUp} className='mt-10 b-2 border-l-pink-400 text-red-600'>SignUp</button>
    </main>
  )
}
