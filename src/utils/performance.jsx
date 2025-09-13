import { enableIndexedDbPersistence } from 'firebase/firestore';

export const LazyImage = ({ src, alt, className }) => {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={className}
    />
  );
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const enableOfflineSupport = async (db) => {
  try {
    await enableIndexedDbPersistence(db);
    console.log('Offline support enabled');
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support offline persistence.');
    }
  }
};