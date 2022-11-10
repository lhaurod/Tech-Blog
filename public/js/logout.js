const timeout = (fn, ms) => {
    return new Promise(resolve => setTimeout(() => {
      fn();
      resolve();
    }, ms));
  };
  
  const redirect = () => {
    document.location.replace(`/`);
  }
  
  timeout(redirect, 2000)