// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
// import { fetchCurrentUser } from '../../api';
// import React from 'react';

// const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
//   const Wrapper = (props: P) => {
//     const router = useRouter();

//     useEffect(() => {
//       const checkAuth = async () => {
//         try {
//           const currentUser = await fetchCurrentUser();
//           if (!currentUser) {
//             router.push('/login');
//           }
//         } catch (error) {
//           console.error('Error checking authentication:', error);
//         }
//       };

//       checkAuth();
//     }, []);

//     return React.createElement(WrappedComponent, props); // Use React.createElement

//   };

//   return Wrapper as React.ComponentType<P>;

// };

// export default withAuth;
