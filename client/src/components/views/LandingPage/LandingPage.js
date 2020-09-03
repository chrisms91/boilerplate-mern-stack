import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = (props) => {
  useEffect(() => {
    // axios.get('/api/hello').then((res) => console.log(res.data));
  }, []);

  const onClickHandler = () => {
    axios.get('/api/users/logout').then((response) => {
      if (response.data.success) {
        props.history.push('/login');
      } else {
        alert('Log out Error');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h2>Landing Page</h2>

      <button onClick={onClickHandler}>Logout</button>
    </div>
  );
};

export default LandingPage;
