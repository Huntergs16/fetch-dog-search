'use client'

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-start p-24">
      <div className="relative w-1/2 h-full">
        <Image
          src="/fetch_logo.png"
          alt="fetch_logo"
          width={1800}
          height={1800}
          loading='eager'
          quality={100}
          style={{objectFit: 'cover'}}
        />
      </div>
      <Login />
    </main>
  )
}

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email}),
          credentials: "include", // Include credentials (cookies) with the request
        }
      );
      // Redirect the user to the search page or perform any other necessary actions
      window.location.href = "/DogSearch"
    } catch (error) {
      // Handle error responses or display error messages
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center min-w-[350px] max-w-[500px]">
      <form className='h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border flex flex-col items-center py-10 px-6 gap-4 w-full rounded-xl' onSubmit={handleSubmit}>
        <div className='flex flex-col w-5/6'>
          <label className='font-semibold text-lg' htmlFor="name">Name:</label>
          <input placeholder='ex: Hunter' className='focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg border-black text-slate-200 bg-[#1b191b]' type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div className='flex flex-col w-5/6'>
          <label className='font-semibold text-lg' htmlFor="email">Email:</label>
          <input placeholder='ex: Hunter@email.com' className='focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b]' type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <button className='bg-[#1b191b] w-2/5 min-w-max px-4 py-2 text-slate-200 rounded-lg hover:opacity-70' type="submit">Login</button>
      </form>
    </div>
  );
};
