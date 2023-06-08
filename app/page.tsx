'use client'

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { login } from '@/api';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-[97vh] w-screen flex-col items-center justify-start gap-4 p-24">
      <div className="relative w-1/2 min-w-[200px] max-w-[500px] h-full">
        <Image
          src="/fetch_logo.png"
          alt="fetch_logo"
          width={1800}
          height={1800}
          loading='eager'
          quality={100}
          className="object-cover"
        />
      </div>
      <p className="text-[#1b191b] text-4xl sm:text-6xl w-full max-w-[1000px] text-center font-sans font-bold">PawFinder</p>
      <Login />
    </main>
  );
}

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const response = await login(name, email);
      console.log(response)
      // Redirect the user to the search page or perform any other necessary actions
      window.location.href = "/DogSearch";
    } catch (error) {
      // Handle error responses or display error messages
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center min-w-[350px] max-w-[500px]">
      <form className="h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border flex flex-col items-center py-10 px-6 gap-4 w-full rounded-xl" >
        <div className="flex flex-col w-5/6">
          <label className="font-semibold text-lg" htmlFor="name">Name:</label>
          <input placeholder="ex: Hunter" className="focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg border-black text-slate-200 bg-[#1b191b]" type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div className="flex flex-col w-5/6">
          <label className="font-semibold text-lg" htmlFor="email">Email:</label>
          <input placeholder="ex: hunter@email.com" className="focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b]" type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <button className="bg-[#1b191b] w-2/5 min-w-max px-4 py-2 text-slate-200 rounded-lg hover:opacity-70" onClick={((event) => handleSubmit(event))}>Login</button>
      </form>
    </div>
  );
};
