import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSideProps } from 'next';

type Props = {

}

function Registration({}: Props) {


	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phoneNumber: '',
		password: '',
	});

	const { name, email, phoneNumber, password } = formData;
	const supabaseClient = useSupabaseClient();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const router = useRouter();
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = false;
		if(res){
			toast.error('User with this email already exists');
		}
		else{
			const { data, error } = await supabaseClient.auth.signUp(
				{
					email: formData.email.toLowerCase(),
					password: formData.password,
					options: {
						data: {
							full_name: formData.name,
							phone_number: formData.phoneNumber,
						}
					}
				}
			);
			if(error) {
				toast.error(error.message);
			}
			else {
				toast.success('Check your email for verification link');
				router.push('/login');
			}
		}
	};

	return (
		<div className='grid grid-cols-1 md:grid-cols-1 bg-yellow-400 h-screen w-full'>

			<div className='bg-yellow-400 flex flex-col justify-center'>
				<ToastContainer
					position="bottom-center"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
				<form className='max-w-[400px] w-full mx-auto space-y-2 rounded-lg  p-8 px-8' onSubmit={onSubmit}>
					<h2 className='text-5xl uppercase dark:text-white font-extrabold mb-10 text-center'>Register	</h2>
					<div className='flex flex-col text-black py-2'>
						<label className='font-bold text-lg'>Name</label>
						<input className='rounded-lg bg-white mt-2 p-2 focus:border-blue-500  focus:outline-none' id="firstName" type="text"
							placeholder="Shivansh Sinha"
							name='name'
							value={name}
							required={true}
							onChange={onChange}
						/>
					</div>
					<div className='flex flex-col text-black py-2'>
						<label className='font-bold text-lg'>Email</label>
						<input className='p-2 rounded-lg bg-white mt-2 focus:border-blue-500  focus:outline-none' id="email"
							type="email"
							placeholder="abc@gmail.com"
							name='email'
							required={true}
							value={email}
							onChange={onChange} />
					</div>
					<div className='flex flex-col text-black py-2'>
						<label className='font-bold text-lg'>PhoneNumber</label>
						<input className='p-2 rounded-lg bg-white mt-2 focus:border-blue-500  focus:outline-none' id="phoneNumber"
							type="text"
							minLength={10}
							placeholder="78001*****"
							name='phoneNumber'
							value={phoneNumber}
							required={true}
							onChange={onChange}
							maxLength={10} />
					</div>
					<div className='flex flex-col text-black py-2'>
						<label className='font-bold text-lg'>Password</label>
						<input className='p-2 rounded-lg bg-white mt-2 focus:border-blue-500  focus:outline-none' id="password"
							type="password"
							minLength={6}
							placeholder="78001*****"
							name='password'
							value={password}
							required={true}
							onChange={onChange}
							maxLength={10} />
					</div>
					<button className='w-full my-5 py-2 bg-red-500 shadow-lg shadow-red-500/50 hover:shadow-red-500/40 text-white font-semibold rounded-lg' type='submit'>Register</button>
					<div className='flex items-center justify-center text-gray-400 py-2'>
						<Link href='/' className='items-center font-semibold'>Cancel</Link>
					</div>

					<div className='text-center '>
						<p className='text-blue-500 font-semibold cursor-pointer'>
							<Link href='/login'>Already a user ? Sign in </Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Registration
