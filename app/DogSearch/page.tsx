'use client'

import { useEffect, useState } from 'react';
import { 
  fetchBreeds, 
  searchDogs, 
  fetchDogs, 
  fetchNextResults, 
  fetchPreviousResults, 
  matchDogForAdoption } from '../../api';
import { DogWithCustomAge, DogSearchResult, Match } from "../../types/globalTypes"
import { convertAgeToString } from '@/util/typing/util';
import Image from 'next/image';
import { setTimeout } from 'timers';


const DogsPage = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]); // Array to store selected breeds
  const [currSelectedBreed, setCurrSelectedBreed] = useState<string | undefined>(undefined)
  const [zipCodes, setZipCodes] = useState<string[]>([]); // Array to store inputted zip codes
  const [currZipCode, setCurrZipCode] = useState<string | undefined>(undefined)
  const [dogsFound, setDogsFound] = useState<DogWithCustomAge[]>([])

  const [ageMin, setAgeMin] = useState<number>(0)
  const [ageMax, setAgeMax] = useState<number>(15)

  const [nextQuery, setNextQuery] = useState<string | undefined>(undefined)
  const [prevQuery, setPrevQuery] = useState<string | undefined>(undefined)

  const [favorites, setFavorites] = useState<DogWithCustomAge[]>([]);
  const [favoritesIds, setFavoriteIds] = useState<string[]>([])

  const [progress, setProgress] = useState<string>("")

  const handleBreedSearch = (event: { target: { value: string; }; }) => {
    const searchText = event.target.value.toLowerCase();
    const filteredBreeds = breeds.filter((breed: string) => breed.toLowerCase().includes(searchText));
    setSearchResults(filteredBreeds.slice(0, 5)); // Display only the first 5 best matches
  };

  useEffect(() => {
    const fetchData = async () => {
      setProgress("Component mounted. Starting data fetch");
      try {
        const dogsData = await fetchBreeds();
        setProgress("Data fetch complete. Setting dog Data and stopping load");
        setProgress(dogsData)
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
    if (searchRes.next) {
      console.log("Next results valid")
      setNextQuery(searchRes.next)
    }
    if (searchRes.prev) {
      console.log("Previous results valid")
      setPrevQuery(searchRes.prev)
    }
  
    console.log(searchRes.total, " Dogs Found");
    console.log(searchRes)
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-12 w-screen min-h-screen justify-center items-center'>
        <div className='animate-bounce'>
          <Image className='motion-safe:animate-[spin_1.75s_linear_infinite]' width={120} height={120} alt='loading bone' src={"/bone.png"}/>
        </div>
        <p className='text-[#1b191b] text-4xl sm:text-6xl w-full max-w-[1000px] text-center font-sans font-bold'>Loading...</p>
        <p className='text-[#1b191b] opacity-70 text-lg sm:text-2xl w-full max-w-[1000px] text-center font-sans font-bold'>{progress}</p>
      </div>
    )
  }

  async function handleNextResults() {
    console.log("inside handleNextResutls")
    console.log("nextQuery = ", nextQuery)
    if (nextQuery) {
        const nextFound:DogSearchResult = await fetchNextResults(nextQuery);
        const dogsFound = await fetchDogs(nextFound.resultIds)
        console.log("Dogs found:", nextFound.resultIds.length)
        setDogsFound(dogsFound);
        if (nextFound.next) {
          console.log("Next results valid")
          setNextQuery(nextFound.next)
        }
        if (nextFound.prev) {
          console.log("Previous results valid")
          setPrevQuery(nextFound.prev)
        }
        console.log("Next results", nextFound)
    }
  }

  async function handlePrevResults() {
    if (prevQuery) {
        const prevFound:DogSearchResult = await fetchPreviousResults(prevQuery);
        const dogsFound = await fetchDogs(prevFound.resultIds)
        console.log("Dogs found:", prevFound.resultIds.length)
        setDogsFound(dogsFound);
        if (prevFound.next) {
          setNextQuery(prevFound.next)
        }
        if (prevFound.prev) {
          setPrevQuery(prevFound.prev)
        }
        console.log("Previous results", prevFound)
    }
  }

  const toggleFavoriteAdd = (dog: DogWithCustomAge) => {
    if (favoritesIds.includes(dog.id)) {
      setFavorites((prevFavorites) => prevFavorites.filter((favorite) => favorite !== dog));
      setFavoriteIds((prevFavoritesIds) => prevFavoritesIds.filter((favoriteId) => favoriteId !== dog.id));
    }
    else {
      setFavorites((prevFavorites) => [...prevFavorites, dog]);
      setFavoriteIds((prevFavoritesIds) => [...prevFavoritesIds, dog.id]);
    }
  };

  const handleClearSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedBreeds([]);
    setZipCodes([]);
    setDogsFound([]);
    setNextQuery(undefined);
    setPrevQuery(undefined);
    setAgeMin(0);
    setAgeMax(15);
  }


  return (
    <main className='flex min-h-[97vh] w-screen flex-col items-center justify-start gap-6 p-6 sm:p-24'>
      <p className='text-[#1b191b] text-4xl sm:text-6xl w-full max-w-[1000px] text-center font-sans font-bold'>Find Your Furry Friend Today</p>
      <form className='flex flex-wrap justify-center h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border py-10 px-6 gap-4 w-full max-w-[1000px] rounded-xl' onSubmit={handleFormSubmit}>
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

        <div className='w-full flex justify-center items-center gap-10'>
          <button className='w-1/5 bg-slate-200 bg-opacity-70 min-w-max px-4 py-2 text-[#1b191b] font-medium rounded-lg hover:opacity-70' onClick={(event) => handleClearSearch(event)}>
            Clear
          </button>
          <button className='w-1/5 bg-[#1b191b] min-w-max px-4 py-2 text-slate-200 rounded-lg hover:opacity-70' type='submit'>
            Search
          </button>
        </div>
      </form>

      <MatchFinder toggleFavorite={toggleFavoriteAdd} favoritesIds={favoritesIds} favoriteDogs={favorites}/>

      {dogsFound.length > 0 && <SearchResultsSection favoritesIds={favoritesIds} handleFavorite={toggleFavoriteAdd} dogsFound={dogsFound} getNext={handleNextResults} getPrev={handlePrevResults} />}
    </main>
  );
};

const SearchResultsSection = ({dogsFound, getNext, getPrev, handleFavorite, favoritesIds}: 
  {
    dogsFound: DogWithCustomAge[],
    getNext: () => Promise<void>,
    getPrev: () => Promise<void>,
    handleFavorite: (dog: DogWithCustomAge) => void,
    favoritesIds: string[],
}) => {
  return (
    <div className='flex flex-wrap justify-center h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border py-10 px-6 gap-4 w-full max-w-[1000px] rounded-xl'>
        <ResultsNavigator getNext={getNext} getPrev={getPrev} />
        <ul className='flex flex-col gap-4 w-full text-base'>
        <li className='text-lg grid grid-cols-6 sm:grid-cols-7 w-full place-items-center gap-4'>
              <div />
              <div />
              <div />
              <div className='sm:hidden'/>
              <p className='hidden sm:block'>Name</p>
              <p className='hidden sm:block'>Breed</p>
              <p>Age</p>
              <p>Zipcode</p>
              </li>
          {dogsFound.map((dog, index) => (
            <li className='grid grid-cols-6 sm:grid-cols-7 w-full place-items-center gap-4' key={index}>
              <Image onClick={() => handleFavorite(dog)} className='bg-transparent cursor-pointer hover:scale-110 active:scale-90' alt='like button' width={30} height={30} src={favoritesIds.includes(dog.id) ? "/heart-filled.png" : "/heart-like-button.png"} />
              <div className='col-span-2 relative w-full h-48 rounded-xl overflow-hidden hover:h-52 transition-all duration-100 ease-linear'>
                <Image className='rounded-xl object-fill hover:object-contain transition-all duration-1000 ease-in' src={dog.img} fill alt={`${dog.name} the ${dog.breed}`} />
              </div>
              <div className='flex flex-col place-items-center sm:hidden'>
                <p>{dog.name}</p>
                <p>{dog.breed}</p>
              </div>
              <p className='hidden sm:block'>{dog.name}</p>
              <p className='hidden sm:block'>{dog.breed}</p>
              <p>{convertAgeToString(dog.age)}</p>
              <p>{dog.zip_code}</p>
              </li>
          ))}
        </ul>
        <ResultsNavigator getNext={getNext} getPrev={getPrev} />
      </div>
  )
}

const MatchFinder = ({favoriteDogs, favoritesIds, toggleFavorite}: {
  favoriteDogs: DogWithCustomAge[],
  favoritesIds: string[],
  toggleFavorite: (dog: DogWithCustomAge) => void,
}) => {

  const [match, setMatch] = useState<DogWithCustomAge | undefined>(undefined)

  const [matchLoading, setMatchLoading] = useState<boolean>(false)

  useEffect(() => {
    setMatch(undefined);
    setMatchLoading(false);
  }, [favoriteDogs])

  const handleMatchFind = async () => {
    console.log('handleMatchFind');
    const matchIdFound: Match = await matchDogForAdoption(favoritesIds);
    const dogMatch = favoriteDogs.find((dog) => dog.id === matchIdFound.match);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setMatchLoading(false);
    setMatch(dogMatch);
  };

  const handleResetMatch = () => {
    setMatch(undefined);
    setMatchLoading(true);
    handleMatchFind();
  }


  return (
    <div className='flex flex-col flex-wrap items-center justify-between h-max bg-[#fba819] bg-opacity-60 shadow-xl border-[#fba819] border-double border py-10 px-6 gap-20 w-full max-w-[1000px] rounded-xl'>
      {favoriteDogs.length !== 0 && 
        <div className='w-full flex flex-col justify-center items-center gap-4'>
          <p className='text-[#1b191b] text-lg sm:text-2xl w-full max-w-[1000px] text-center font-sans font-bold'>Your Favorites</p>
          <ul className='w-full flex flex-wrap justify-center items-center gap-8'>
            {favoriteDogs.map((dog, index) => {
              return (
                <li key={index} className='w-max flex justify-center items-center gap-2'>
                  <Image src={"/delete-favorite.png"} width={40} height={40} alt='remove favorite' className='hover:opacity-70 text-xl cursor-pointer' onClick={() => toggleFavorite(dog)} />
                  <div className='relative w-24 h-24 rounded-xl overflow-hidden hover:h-32 hover:w-32 transition-all duration-100 ease-linear'>
                    <Image className='rounded-xl object-fill hover:object-contain transition-all duration-1000 ease-in' src={dog.img} fill alt={`${dog.name} the ${dog.breed}`} />
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <p>{dog.name}</p>
                    <p>{dog.breed}</p>
                  </div>
                  </li>
              )
            })}     
            </ul>
          </div>
        }
      {favoriteDogs.length !== 0 && match === undefined && matchLoading ? (
        <div className='animate-bounce'>
          <Image className='motion-safe:animate-[spin_1.75s_linear_infinite]' width={70} height={70} alt='loading bone' src={"/bone.png"}/>
        </div>
      ) : favoriteDogs.length !== 0 ? (
        match === undefined ? (
          <button className="w-1/5 bg-[#1b191b] h-max min-w-max px-5 py-3 text-slate-200 rounded-lg hover:opacity-70" onClick={() => {setMatchLoading(true); 
          handleMatchFind()}}>
            Generate Match
          </button>
        ) : (
          <div className="w-max flex flex-col justify-center items-center gap-2">
            <p className="mb-6 text-[#1b191b] text-2xl sm:text-4xl w-full max-w-[1000px] text-center font-sans font-bold">Match Found!</p>
            <div className="relative rounded-xl overflow-hidden h-32 w-32 transition-all duration-100 ease-linear">
              <Image className="rounded-xl object-fill transition-all duration-1000 ease-in" src={match.img} fill alt={`${match.name} the ${match.breed}`} />
            </div>
            <p className="text-xl font-bold">
              {match.name} the {match.breed}
            </p>
            <div className="flex gap-2 justify-center items-center text-base font-bold">
              <p>Age: {convertAgeToString(match.age)}</p>
              <p>Zipcode: {match.zip_code}</p>
            </div>
            <Image onClick={handleResetMatch} className='hover:animate-[spin_1.75s_linear_infinite] cursor-pointer' width={30} height={30} alt='retry' src={"/retry.png"} />
          </div>
        )
      ) : (
        <p className="text-[#1b191b] text-xl sm:text-3xl w-full max-w-[1000px] text-center font-sans font-bold">Add some favorites to get matched</p>
      )}
    </div>
  )
}

const ResultsNavigator = ({getNext, getPrev}: {
  getNext: () => Promise<void>,
  getPrev: () => Promise<void>,
}) => {
  return (
    <div className='w-full px-2 flex justify-between items-center'>
      <button onClick={getPrev} className='w-[10%] bg-[#1b191b] min-w-max px-3 py-1 text-slate-200 rounded-lg hover:opacity-70'>{"<-"} Prev</button>
      <button onClick={getNext} className='w-[10%] bg-[#1b191b] min-w-max px-3 py-1 text-slate-200 rounded-lg hover:opacity-70'>Next {"->"}</button>
    </div>
  )
}

export default DogsPage;
