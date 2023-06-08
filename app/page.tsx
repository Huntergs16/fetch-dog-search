'use client';

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { login } from '@/api';
import Image from 'next/image';
import { z } from 'zod';

const schema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
});

const cuteMessages = ["To help life be less ruff", "Furry up and find your next companion", "Happy memories fur-ever",
                      "A wag-nificent way to find a pupper", "Warning: dogs cause happiness", "They help clean spilled food off the ground"]

export default function Home() {

  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % cuteMessages.length);
    }, 6000);

    return () => {
      clearInterval(interval); // Cleanup the interval on component unmount
    };
  }, []);


  return (
    <main className="flex min-h-[97vh] w-screen flex-col items-center justify-start gap-16 p-16`">
      <div className="relative w-1/3 min-w-[200px] max-w-[500px] h-full">
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
      <div className='flex flex-col justify-center items-center gap-4'>
        <p className="text-[#1b191b] text-4xl sm:text-6xl w-full max-w-[1000px] text-center font-sans font-bold">PawFinder</p>
        <p className="text-[#1b191b] opacity-80 text-base sm:text-xl w-full max-w-[1000px] text-center font-sans font-bold">({cuteMessages[messageIndex]})</p>
      </div>
      <Login />
    </main>
  );
}

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string[]; email?: string[] }>({});

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validatedData = schema.parse({ name, email });

      const response = await login(validatedData.name, validatedData.email);
      console.log(response);
      if (response === "OK") {
        // Redirect the user to the search page or perform any other necessary actions
        window.location.href = "/DogSearch";
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors);
      } else {
        // Handle other errors
        console.error('Error logging in:', error);
      }
    }
  };


  return (
    <div className="w-full h-full px-6 flex flex-col items-center min-w-[350px] max-w-[500px]">
      <form className="h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border flex flex-col items-center py-10 px-6 gap-4 w-full rounded-xl" onSubmit={handleSubmit}>
        <div className="flex flex-col w-5/6">
          <label className="font-semibold text-lg" htmlFor="name">Name:</label>
          <input placeholder="ex: Hunter" className="focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg border-black text-slate-200 bg-[#1b191b]" type="text" id="name" value={name} onChange={handleNameChange} />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="flex flex-col w-5/6">
          <label className="font-semibold text-lg" htmlFor="email">Email:</label>
          <input placeholder="ex: huntergabriel1@gmail.com" className="focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b]" type="email" id="email" value={email} onChange={handleEmailChange} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <button className="bg-[#1b191b] w-2/5 min-w-max px-4 py-2 text-slate-200 rounded-lg hover:opacity-70" type='submit'>Login</button>
      </form>
    </div>
  );
};
