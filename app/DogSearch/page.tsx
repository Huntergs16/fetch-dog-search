'use client';

import { useEffect, useState } from 'react';
import { fetchBreeds, searchDogs, fetchDogs } from '../../api';
import { Dog, DogSearchResult } from "../../types/globalTypes"
import Image from 'next/image';

const DogsPage = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]); // Array to store selected breeds
  const [currSelectedBreed, setCurrSelectedBreed] = useState<string | undefined>(undefined)
  const [zipCodes, setZipCodes] = useState<string[]>([]); // Array to store inputted zip codes
  const [currZipCode, setCurrZipCode] = useState<string | undefined>(undefined)
  const [dogsFound, setDogsFound] = useState<Dog[]>([])

  const [ageMin, setAgeMin] = useState<number>(0)
  const [ageMax, setAgeMax] = useState<number>(100)

  const handleBreedSearch = (event: { target: { value: string; }; }) => {
    const searchText = event.target.value.toLowerCase();
    const filteredBreeds = breeds.filter((breed: string) => breed.toLowerCase().includes(searchText));
    setSearchResults(filteredBreeds.slice(0, 5)); // Display only the first 5 best matches
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dogsData = await fetchBreeds();
        console.log(dogsData)
        setBreeds(dogsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    fetchData();
  }, []);

  function handleInputChange(event: { target: { value: string } }) {
    handleBreedSearch(event);
    setCurrSelectedBreed(event.target.value);
    setInputFocused(true);
  }

  function handleBreedClick(breed: string) {
    if (!selectedBreeds.includes(breed)) {
      setSelectedBreeds((prevSelectedBreeds) => [...prevSelectedBreeds, breed]);
    }
    setInputFocused(false);
    setCurrSelectedBreed("");
  }

  function handleZipCodeChange(zipCode: string) {
    if (!zipCodes.includes(zipCode) && zipCode.length !== 0) {
      setZipCodes((prevZipCodes) => [...prevZipCodes, zipCode]);
    }
    setCurrZipCode("");
  }

  async function handleFormSubmit (event: React.FormEvent) {
    event.preventDefault();
    console.log('form submitted');
    console.log('Selected Breeds:', selectedBreeds);
    console.log('Zip Codes:', zipCodes);
    const searchRes:DogSearchResult = await searchDogs({breeds: selectedBreeds, zipCodes, ageMin, ageMax});
    if (searchRes.total != 0) {
      const dogsFound = await fetchDogs(searchRes.resultIds)
      console.log("Dogs found:", dogsFound)
      setDogsFound(dogsFound);
    }
    console.log(searchRes.total, " Dogs Found");
    console.log(searchRes)
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  // async function handleNextResults() {
  //   if (nextQuery) {
  //       const dogsFound = await fetchDogs(dogSearchIds!, nextQuery)
  //       console.log("Dogs found:", dogsFound)
  //       setDogsFound(dogsFound);
  //     }
  //     if (searchRes.next) {
  //       setNextQuery(searchRes.next)
  //     }
  //     if (searchRes.prev) {
  //       setPrevQuery(searchRes.prev)
  //     }
  //     console.log(searchRes.total, " Dogs Found");
  //     console.log(searchRes)
  //   }
  // }

  return (
    <main className='flex min-h-screen w-screen flex-col items-center justify-start gap-6 p-6 sm:p-24'>
      <p className='text-[#1b191b] text-4xl sm:text-6xl w-full max-w-[900px] text-center font-sans font-bold'>Find Your Furry Friend Today</p>
      <form className='flex flex-wrap justify-center h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border py-10 px-6 gap-4 w-full max-w-[900px] rounded-xl' onSubmit={handleFormSubmit}>
      <div className='flex flex-col justify-center items-center w-full'>
          <input
            placeholder='Breed'
            className={`w-4/5 sm:w-1/2 focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b] ${inputFocused ? 'border-black' : ''}`}
            type='text'
            id='breeds'
            name='breeds'
            value={currSelectedBreed}
            onChange={handleInputChange}
          />
          {inputFocused && searchResults.length > 0 && (
            <div className='w-[90%] mt-2 p-2 rounded-lg bg-[#1b191b] text-slate-200 overflow-y-hidden max-h-20'>
              <ul>
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className='cursor-pointer hover:text-blue-500'
                    onClick={() => handleBreedClick(result)}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ul className='flex justify-center items-center flex-wrap gap-2 w-full'>
            {selectedBreeds.map((breed, index) => (
              <li key={index} className='text-slate-800'>
                {index === (selectedBreeds.length-1) ? `${breed}` : `${breed},`} 
              </li>
            ))}
          </ul>
        </div>

        <div className='grid grid-cols-4 place-items-center w-full'>
          <div />
          <input
            placeholder='Zip Code'
            className='w-full col-span-2 focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b]'
            type='text'
            id='zipCodes'
            name='zipCodes'
            value={currZipCode}
            onChange={((event) => setCurrZipCode(event?.currentTarget.value))}
          />
          <button className='text-5xl mr-auto relative bottom-1 hover:opacity-70' onClick={(event) => {
            event.preventDefault()
            handleZipCodeChange(currZipCode || "")
            }}>+</button>
          <ul className='col-span-4 flex justify-center items-center flex-wrap gap-2'>
            {zipCodes.map((zipcode, index) => (
              <li key={index} className='text-slate-800'>
                {index === (zipCodes.length-1) ? `${zipcode}` : `${zipcode},`} 
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col justify-center items-center gap-1'>
          <div className='grid grid-cols-3 place-items-center'>
            <p className='ml-auto text-slate-800 font-semibold'>Min Age:</p>
            <input
              placeholder='Min Age'
              className='w-3/4 focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b]'
              type='number'
              id='ageMin'
              name='ageMin'
              value={ageMin}
              onChange={(event) => setAgeMin(Number(event?.currentTarget.value))}
              />
              <div />
          </div>

          <div className='grid grid-cols-3 place-items-center'>
            <p className='ml-auto text-slate-800 font-semibold'>Max Age: </p>
            <input
              placeholder='Max Age'
              className='w-3/4 focus:py-2 transition-all duration-100 px-2 py-1 rounded-lg focus:border border-black text-slate-200 bg-[#1b191b]'
              type='number'
              id='ageMax'
              name='ageMax'
              value={ageMax}
              onChange={(event) => setAgeMax(Number(event?.currentTarget.value))}
              />
              <div />
          </div>
        </div>

        <div className='w-full flex justify-center items-center'>
          <button className='w-1/5 bg-[#1b191b] min-w-max px-4 py-2 text-slate-200 rounded-lg hover:opacity-70' type='submit'>
            Search
          </button>
        </div>
      </form>

      {dogsFound.length > 0 && <SearchResultsSection dogsFound={dogsFound} />}
    </main>
  );
};

const SearchResultsSection = ({dogsFound}: 
  {
    dogsFound: Dog[]
  }) => {
  return (
    <div className='flex flex-wrap justify-center h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border py-10 px-6 gap-4 w-full max-w-[900px] rounded-xl'>
        <ResultsNavigator />
        <ul className='flex flex-col gap-4 w-full text-base'>
        <li className='text-lg grid grid-cols-4 sm:grid-cols-5 w-full place-items-center gap-4'>
              <div />
              <div className='sm:hidden'/>
              <p className='hidden sm:block'>Name</p>
              <p className='hidden sm:block'>Breed</p>
              <p>Age</p>
              <p>Zipcode</p>
              </li>
          {dogsFound.map((dog, index) => (
            <li className='grid grid-cols-4 sm:grid-cols-5 w-full place-items-center gap-4' key={index}>
              <Image src={dog.img} height={100} width={100} alt={`${dog.name} the ${dog.breed}`} />
              <div className='flex flex-col place-items-center sm:hidden'>
                <p>{dog.name}</p>
                <p>{dog.breed}</p>
              </div>
              <p className='hidden sm:block'>{dog.name}</p>
              <p className='hidden sm:block'>{dog.breed}</p>
              <p>{dog.age}</p>
              <p>{dog.zip_code}</p>
              </li>
          ))}
        </ul>
        <ResultsNavigator />
      </div>
  )
}

const ResultsNavigator = () => {
  return (
    <div className='w-full px-2 flex justify-between items-center'>
      <button className='w-[10%] bg-[#1b191b] min-w-max px-3 py-1 text-slate-200 rounded-lg hover:opacity-70'>{"<-"} Prev</button>
      <button className='w-[10%] bg-[#1b191b] min-w-max px-3 py-1 text-slate-200 rounded-lg hover:opacity-70'>Next {"->"}</button>
    </div>
  )
}

export default DogsPage;
