import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
  // null    => anyone can access this page
  // true    => logged in users can access this page
  // false   => logged in users can not access this page
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        // not logged in
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          }
        } else {
          // currently logged in

          // trying to access admin page but user is not admin
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/');
          } else {
            if (!option) {
              props.history.push('/');
            }
          }
        }
      });
    }, []);

    return <SpecificComponent {...props} />;
  }

  return AuthenticationCheck;
}
